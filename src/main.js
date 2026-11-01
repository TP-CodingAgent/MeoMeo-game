/**
 * Cute Cat Bubble Shooter - Main Game Orchestrator
 * Integrates First-Person Blaster, Multi-Tier Depth Aiming, Flying Birds,
 * Cat Leaping Physics, and Real-time Collision Detection.
 */

import { Cannon } from './systems/cannon.js';
import { CatSpawner } from './systems/spawner.js';
import { BubblePool } from './entities/bubble.js';
import { ParticlePool } from './entities/particle.js';
import { SceneManager, STAGE_CONFIGS } from './scenes/scene-manager.js';
import { AudioManager } from './audio/audio-manager.js';
import { isCircleCollidingCircle, isCircleCollidingAABB } from './utils/math-physics.js';
import { CAT_CATALOG, BUBBLE_SHAPES } from './data/cat-catalog.js';
import { safeStorage } from './utils/safe-storage.js';

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER'
};

export const GAME_MODES = {
  RELAX: 'RELAX',
  CHALLENGE: 'CHALLENGE'
};

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = 1280;
    this.height = 720;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Core Systems
    this.cannon = new Cannon(this.width, this.height);
    this.spawner = new CatSpawner();
    this.bubblePool = new BubblePool(70);
    this.particlePool = new ParticlePool(250);
    this.sceneManager = new SceneManager();
    this.audioManager = new AudioManager();

    // Game Session State
    this.state = GAME_STATES.MENU;
    this.mode = GAME_MODES.RELAX;
    this.score = 0;
    this.highScore = parseInt(safeStorage.getItem('cat_shooter_high_score') || '0', 10);
    this.timeRemaining = 60.0;
    this.catsPettedCount = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    // Toast banner
    this.toastMessage = null;
    this.toastTimer = 0;

    // Timing
    this.lastTime = performance.now();
    this.isRunning = false;

    // Pointer coordinates & Cached Rect (Zero Layout Thrashing on mousemove)
    this.pointerX = this.width / 2;
    this.pointerY = this.height / 2;
    this.isFiring = false;
    this.cachedRectLeft = 0;
    this.cachedRectTop = 0;
    this.scaleX = 1;
    this.scaleY = 1;

    this.bindEvents();
    this.loadSettings();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('scroll', () => this.updateCachedRect(), { passive: true });
  }

  loadSettings() {
    try {
      const raw = safeStorage.getItem('bubble_cat_settings');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.maxAmmo !== undefined) this.cannon.setMaxWater(s.maxAmmo);
        if (s.minCats !== undefined) this.spawner.setMinCats(s.minCats);
        if (s.cooldownDuration !== undefined) this.cannon.setCooldownDuration(s.cooldownDuration);
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
  }

  saveSettings(settings) {
    try {
      if (settings.maxAmmo !== undefined) this.cannon.setMaxWater(settings.maxAmmo);
      if (settings.minCats !== undefined) this.spawner.setMinCats(settings.minCats);
      if (settings.cooldownDuration !== undefined) this.cannon.setCooldownDuration(settings.cooldownDuration);
      safeStorage.setItem('bubble_cat_settings', JSON.stringify({
        maxAmmo: this.cannon.maxWater,
        minCats: this.spawner.minActiveCats,
        cooldownDuration: this.cannon.cooldownDuration
      }));

      // Immediately replenish active cats if below new minimum
      while (this.spawner.activeCats.length < this.spawner.minActiveCats) {
        if (!this.spawner.spawnCat(this.sceneManager.props, this.sceneManager.platforms)) break;
      }
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }

  resetAllData() {
    try {
      safeStorage.removeItem('cat_shooter_high_score');
      safeStorage.removeItem('bubble_cat_settings');
      safeStorage.removeItem('cute_cat_collection');
      safeStorage.removeItem('cute_cat_unlocked_shapes');
      safeStorage.removeItem('cat_shooter_muted');
      safeStorage.clear();
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('Failed to clear storage data', e);
    }

    // Reset in-memory game state
    this.highScore = 0;
    this.score = 0;
    this.cannon.setMaxWater(20);
    this.cannon.currentWater = 20;
    this.cannon.setCooldownDuration(2.0);
    this.spawner.setMinCats(4);
    this.sceneManager.unlockedCats = new Set();
    this.sceneManager.unlockedBubbleShapes = new Set(['heart']);
    this.setStage(0);
  }

  setStage(index) {
    this.sceneManager.loadStage(index);
    this.spawner.reset();
    const minToSpawn = Math.max(2, this.spawner.minActiveCats);
    for (let i = 0; i < minToSpawn; i++) {
      const usePlatform = i >= 2 && this.sceneManager.platforms.length > 0;
      this.spawner.spawnCat(this.sceneManager.props, usePlatform ? this.sceneManager.platforms : []);
    }
  }

  nextStage() {
    this.setStage((this.sceneManager.currentStageIndex + 1) % STAGE_CONFIGS.length);
  }

  resizeCanvas() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const contW = container.clientWidth;
    const contH = container.clientHeight;
    const aspect = this.width / this.height;

    let displayW = contW;
    let displayH = contW / aspect;

    if (displayH > contH) {
      displayH = contH;
      displayW = contH * aspect;
    }

    this.canvas.style.width = `${Math.floor(displayW)}px`;
    this.canvas.style.height = `${Math.floor(displayH)}px`;

    // Cache canvas screen bounds and coordinate scales (Zero layout thrashing on mousemove)
    this.updateCachedRect();
  }

  updateCachedRect() {
    if (!this.canvas || typeof this.canvas.getBoundingClientRect !== 'function') return;
    const rect = this.canvas.getBoundingClientRect();
    this.cachedRectLeft = rect.left;
    this.cachedRectTop = rect.top;
    this.scaleX = this.width / (rect.width || 1);
    this.scaleY = this.height / (rect.height || 1);
  }

  getVirtualCoords(clientX, clientY) {
    return {
      x: (clientX - this.cachedRectLeft) * this.scaleX,
      y: (clientY - this.cachedRectTop) * this.scaleY
    };
  }

  bindEvents() {
    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.pointerX = (clientX - this.cachedRectLeft) * this.scaleX;
      this.pointerY = (clientY - this.cachedRectTop) * this.scaleY;
      this.cannon.setTarget(this.pointerX, this.pointerY);
    };

    const onPointerDown = (e) => {
      if (e.target !== this.canvas) return;
      this.audioManager.init();
      onPointerMove(e);
      this.shootBubble();
      this.isFiring = true;
    };

    const onPointerUp = () => {
      this.isFiring = false;
    };

    this.canvas.addEventListener('mousemove', onPointerMove);
    this.canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    this.canvas.addEventListener('touchmove', onPointerMove, { passive: false });
    this.canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.shootBubble();
      }
    });
  }

  shootBubble() {
    if (this.state !== GAME_STATES.PLAYING) return;

    const bubbleData = this.cannon.fire();
    if (bubbleData) {
      const b = this.bubblePool.spawn(
        bubbleData.x,
        bubbleData.y,
        bubbleData.vx,
        bubbleData.vy,
        bubbleData.color,
        bubbleData.radius,
        bubbleData.shape,
        bubbleData.targetX,
        bubbleData.targetY
      );
      if (b) {
        this.audioManager.playShoot();
        this.particlePool.burst(bubbleData.x, bubbleData.y, bubbleData.color, 4, 'droplet');
      }
    }
  }

  start(mode = GAME_MODES.RELAX) {
    this.mode = mode;
    this.state = GAME_STATES.PLAYING;
    this.score = 0;
    this.catsPettedCount = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.timeRemaining = 60.0;

    this.bubblePool.clear();
    this.particlePool.clear();
    this.cannon.reset();
    this.spawner.reset();

    // Spawn initial cats adhering to spawner.minActiveCats
    const minToSpawn = Math.max(2, this.spawner.minActiveCats);
    for (let i = 0; i < minToSpawn; i++) {
      const usePlatform = i >= 2 && this.sceneManager.platforms.length > 0;
      this.spawner.spawnCat(this.sceneManager.props, usePlatform ? this.sceneManager.platforms : []);
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  pause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
    }
  }

  resume() {
    if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
      this.lastTime = performance.now();
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    if (this.state === GAME_STATES.PLAYING) {
      this.update(dt);
    }

    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.mode === GAME_MODES.CHALLENGE) {
      this.timeRemaining -= dt;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.finishChallenge();
        return;
      }
    }

    if (this.comboCount > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    if (this.toastMessage) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) {
        this.toastMessage = null;
      }
    }

    const prevCooldown = this.cannon.isCoolingDown;
    this.cannon.update(dt);
    if (prevCooldown && !this.cannon.isCoolingDown) {
      this.audioManager.playReload();
    }

    // Update scene (birds flying, etc.)
    this.sceneManager.update(dt);

    for (const prop of this.sceneManager.props) {
      prop.update(dt);
    }

    this.spawner.update(
      dt,
      { width: this.width, height: this.height },
      this.sceneManager.props,
      this.sceneManager.platforms
    );

    this.bubblePool.update(dt, { width: this.width, height: this.height }, this.particlePool);
    this.particlePool.update(dt);

    this.checkCollisions();
  }

  checkCollisions() {
    const bubbles = this.bubblePool.pool;
    const activeCats = this.spawner.activeCats;
    const props = this.sceneManager.props;
    const birds = this.sceneManager.birds;

    for (let bIdx = 0; bIdx < bubbles.length; bIdx++) {
      const bubble = bubbles[bIdx];
      if (!bubble.alive) continue;

      let bubblePopped = false;

      // 1. Check collision with Cats
      for (const cat of activeCats) {
        if (!cat.isHittable()) continue;

        if (isCircleCollidingCircle(bubble.x, bubble.y, bubble.radius, cat.x, cat.y, cat.radius)) {
          bubble.pop(this.particlePool);
          this.audioManager.playPop();

          const catCatalog = cat.onHit(bubble.colorHex, this.particlePool, this.audioManager);

          // Scoring
          this.comboCount++;
          this.comboTimer = 3.2;
          const comboMultiplier = Math.min(this.comboCount, 5);
          const gainedScore = 100 * catCatalog.rarity * comboMultiplier;
          this.score += gainedScore;
          this.catsPettedCount++;

          // Unlock cat in Encyclopedia
          const isNewlyUnlocked = this.sceneManager.unlockCat(catCatalog.id);
          if (isNewlyUnlocked) {
            this.audioManager.playUnlock();
            this.showToast(`🎉 Mới sưu tập: ${catCatalog.flag} ${catCatalog.name}!`);
          }

          // Check Shape Unlock
          if (catCatalog.shapeReward) {
            const isNewShape = this.sceneManager.unlockShape(catCatalog.shapeReward);
            if (isNewShape) {
              const shapeInfo = BUBBLE_SHAPES[catCatalog.shapeReward];
              this.audioManager.playShapeUnlock();
              this.showToast(`✨ Mở khoá hình bọt mới: ${shapeInfo.icon} ${shapeInfo.name}!`);
              if (window.onShapeUnlocked) {
                window.onShapeUnlocked(shapeInfo);
              }
            }
          }

          bubblePopped = true;
          break;
        }
      }

      if (bubblePopped) continue;

      // 2. Check collision with Flying Birds (Garden stage)
      if (birds && birds.length > 0) {
        for (let i = birds.length - 1; i >= 0; i--) {
          const bird = birds[i];
          if (isCircleCollidingCircle(bubble.x, bubble.y, bubble.radius, bird.x, bird.y, 16)) {
            bubble.pop(this.particlePool);
            this.particlePool.burst(bird.x, bird.y, '#ffd166', 8, 'star');
            this.audioManager.playPop();
            this.audioManager.playMeow();
            // Bird chirps and swoops upward
            bird.y -= 40;
            bird.vx *= 1.8;
            bubblePopped = true;
            break;
          }
        }
      }

      if (bubblePopped) continue;

      // 3. Check collision with Props (Smart Elevation Depth Filtering)
      for (const prop of props) {
        const isGroundProp = prop.y > 450;
        const isAimingHigh = bubble.targetY < 420;

        // In 3D FPS perspective, bubbles aimed at the upper tier fly over ground props!
        if (isGroundProp && isAimingHigh) {
          continue; // Ground prop does NOT block shot aimed at high tier!
        }

        const b = prop.getBounds();
        if (isCircleCollidingAABB(bubble.x, bubble.y, bubble.radius, b.x, b.y, b.width, b.height)) {
          bubble.pop(this.particlePool);
          this.audioManager.playPop();
          prop.onHit(bubble.x, bubble.y, bubble.colorHex, this.particlePool, this.audioManager);
          bubblePopped = true;
          break;
        }
      }
    }
  }

  showToast(msg) {
    this.toastMessage = msg;
    this.toastTimer = 3.5;
  }

  finishChallenge() {
    this.state = GAME_STATES.GAME_OVER;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      safeStorage.setItem('cat_shooter_high_score', this.highScore.toString());
    }
    if (window.onGameFinished) {
      window.onGameFinished({
        score: this.score,
        highScore: this.highScore,
        catsPetted: this.catsPettedCount,
        collectionProgress: this.sceneManager.getCollectionProgress()
      });
    }
  }

  render() {
    // 1. Stage background & Flying Birds
    this.sceneManager.renderBackground(this.ctx, this.width, this.height);

    // 2. Props & Furniture
    for (const prop of this.sceneManager.props) {
      prop.render(this.ctx);
    }

    // 3. Cats
    for (const cat of this.spawner.activeCats) {
      cat.render(this.ctx);
    }

    // 4. Bubbles
    this.bubblePool.render(this.ctx);

    // 5. Particles
    this.particlePool.render(this.ctx);

    // 6. First-Person Blaster & Crosshair
    this.cannon.render(this.ctx);

    // 7. Toast Message
    if (this.toastMessage && this.toastTimer > 0) {
      this.renderToast(this.ctx);
    }
  }

  renderToast(ctx) {
    ctx.save();
    ctx.translate(this.width / 2, 65);
    const alpha = Math.min(1, this.toastTimer);
    ctx.globalAlpha = alpha;

    ctx.fillStyle = 'rgba(45, 52, 54, 0.92)';
    ctx.beginPath();
    ctx.roundRect(-240, -25, 480, 50, 25);
    ctx.fill();

    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.toastMessage, 0, 0);
    ctx.restore();
  }
}
