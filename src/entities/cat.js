/**
 * Cute Cat Bubble Shooter - Cat Entity
 * Rich procedural visuals representing distinct international cat breeds,
 * smooth acceleration/deceleration physics, rarity speed scaling,
 * elevated platforms, and smooth parabolic leap transitions between tiers.
 */

import { CAT_STATES } from '../systems/spawner.js';
import { hexToRgba, lerp, clamp } from '../utils/math-physics.js';

export class Cat {
  constructor(catalogEntry, x = 0, y = 530, platform = null) {
    this.catalog = catalogEntry;
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.targetX = x;
    this.platform = platform; // Current shelf, tree branch, or null for ground floor
    this.radius = catalogEntry.bodyType === 'giant' ? 38 : (catalogEntry.bodyType === 'slender' ? 30 : 34);

    this.state = CAT_STATES.IDLE;
    this.stateTimer = Math.random() * 2 + 1;
    this.direction = Math.random() > 0.5 ? 1 : -1;

    // Smooth movement physics
    this.vx = 0;
    this.vy = 0;
    const rarityBonus = (this.catalog.rarity - 1) * 24;
    this.maxSpeed = 70 + rarityBonus + Math.random() * 25;
    this.accel = 6.0;

    // Leaping physics (jumping between ground floor and shelves/branches)
    this.leapProgress = 0;
    this.leapDuration = 0.75;
    this.leapStartX = x;
    this.leapStartY = y;
    this.leapTargetX = x;
    this.leapTargetY = y;
    this.destPlatform = null;

    // Visual attributes
    this.primaryColor = catalogEntry.primaryColor || '#ffa502';
    this.secondaryColor = catalogEntry.secondaryColor || '#ffffff';
    this.stripesColor = catalogEntry.stripesColor || '#e65100';
    this.eyeColor = catalogEntry.eyeColor || '#2ed573';
    this.breedType = catalogEntry.breedType || 'tabby';
    this.earType = catalogEntry.earType || 'normal';
    this.bodyType = catalogEntry.bodyType || 'round_chubby';

    this.tintColor = null;
    this.tintAlpha = 0;

    // Animation & Emotion
    this.animTime = Math.random() * 10;
    this.hopOffset = 0;
    this.squashStretchX = 1;
    this.squashStretchY = 1;
    this.blinkTimer = Math.random() * 3 + 2;
    this.isBlinking = false;
    this.tailAngle = 0;

    // Hiding logic
    this.currentProp = null;
    this.isHiding = false;
    this.peekFactor = 0;
  }

  hideBehind(prop) {
    this.currentProp = prop;
    this.isHiding = true;
    this.state = CAT_STATES.HIDING;
    this.stateTimer = Math.random() * 3 + 2.5;
    this.x = prop.x;
    this.baseY = prop.y + prop.height * 0.15;
    this.y = this.baseY;
    this.peekFactor = 0;
    this.vx = 0;
    prop.setHidingCat(this);
  }

  startle(sourceX, sourceY) {
    this.isHiding = false;
    if (this.currentProp) {
      this.currentProp.clearHidingCat();
      this.currentProp = null;
    }
    this.state = CAT_STATES.SURPRISED;
    this.stateTimer = 0.55;
    this.squashStretchX = 0.7;
    this.squashStretchY = 1.45;
    this.direction = this.x > sourceX ? 1 : -1;
    this.targetX = this.x + this.direction * (200 + this.catalog.rarity * 35);
  }

  leapTo(destX, destY, destPlatform) {
    this.state = CAT_STATES.LEAPING;
    this.leapStartX = this.x;
    this.leapStartY = this.y;
    this.leapTargetX = destX;
    this.leapTargetY = destY;
    this.destPlatform = destPlatform;
    this.leapProgress = 0;
    this.leapDuration = 0.7 + Math.random() * 0.15;
    this.direction = Math.sign(destX - this.x) || this.direction;
    this.squashStretchX = 0.75;
    this.squashStretchY = 1.4;
  }

  onHit(bubbleColor, particlePool, audioManager) {
    this.tintColor = bubbleColor;
    this.tintAlpha = 1.0;
    this.state = CAT_STATES.CELEBRATING;
    this.stateTimer = 1.25;
    this.squashStretchX = 1.35;
    this.squashStretchY = 0.65;
    this.vx = 0;

    if (this.currentProp) {
      this.currentProp.clearHidingCat();
      this.currentProp = null;
      this.isHiding = false;
    }

    if (particlePool) {
      particlePool.spawnHeart(this.x, this.y - 30);
      particlePool.spawnHeart(this.x + 22, this.y - 48);
      particlePool.spawnHeart(this.x - 22, this.y - 48);
      particlePool.burst(this.x, this.y, bubbleColor, 10, 'star');
    }

    if (audioManager) {
      audioManager.playMeow();
    }

    return this.catalog;
  }

  update(dt, bounds = { width: 1280, height: 720 }, props = [], platforms = []) {
    this.animTime += dt;
    this.stateTimer -= dt;

    // Blinking
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.isBlinking = !this.isBlinking;
      this.blinkTimer = this.isBlinking ? 0.15 : (Math.random() * 3.5 + 2);
    }

    // Squash & Stretch Spring
    this.squashStretchX += (1 - this.squashStretchX) * 12 * dt;
    this.squashStretchY += (1 - this.squashStretchY) * 12 * dt;

    // Tail Wag
    const wagSpeed = (this.state === CAT_STATES.RUNNING || this.state === CAT_STATES.CELEBRATING) ? 9 : 3.5;
    this.tailAngle = Math.sin(this.animTime * wagSpeed) * 0.5;

    // Determine platform or floor bounds
    let minX = 70;
    let maxX = bounds.width - 70;
    if (this.platform) {
      minX = this.platform.x - this.platform.width / 2 + 30;
      maxX = this.platform.x + this.platform.width / 2 - 30;
      this.baseY = this.platform.y - 10;
    } else {
      this.baseY = 530; // Ground floor level
    }

    // State Machine
    switch (this.state) {
      case CAT_STATES.LEAPING:
        this.leapProgress += dt / this.leapDuration;
        if (this.leapProgress >= 1.0) {
          // Land safely
          this.leapProgress = 1.0;
          this.x = this.leapTargetX;
          this.y = this.leapTargetY;
          this.baseY = this.leapTargetY;
          this.platform = this.destPlatform;
          this.state = CAT_STATES.IDLE;
          this.stateTimer = Math.random() * 2.2 + 1.2;
          this.squashStretchX = 1.35;
          this.squashStretchY = 0.7;
        } else {
          // Parabolic trajectory in air
          this.x = lerp(this.leapStartX, this.leapTargetX, this.leapProgress);
          const arc = Math.sin(this.leapProgress * Math.PI) * 120;
          this.y = lerp(this.leapStartY, this.leapTargetY, this.leapProgress) - arc;
        }
        return; // Leaping controls position directly

      case CAT_STATES.IDLE:
        this.vx = lerp(this.vx, 0, dt * this.accel);
        this.hopOffset = 0;
        if (this.stateTimer <= 0) {
          // If on ground:
          if (!this.platform) {
            // Chance to leap up onto an elevated platform
            if (platforms && platforms.length > 0 && Math.random() < 0.35) {
              const destPlat = platforms[Math.floor(Math.random() * platforms.length)];
              const targetX = clamp(
                destPlat.x + (Math.random() - 0.5) * (destPlat.width * 0.6),
                destPlat.x - destPlat.width / 2 + 35,
                destPlat.x + destPlat.width / 2 - 35
              );
              this.leapTo(targetX, destPlat.y - 10, destPlat);
              break;
            }
            // Chance to hide behind ground prop
            if (props.length > 0 && Math.random() < 0.25) {
              const availableProps = props.filter(p => !p.isPlatform && !p.hidingCat);
              if (availableProps.length > 0) {
                const p = availableProps[Math.floor(Math.random() * availableProps.length)];
                this.hideBehind(p);
                break;
              }
            }
            // Walk along the ground floor
            this.state = CAT_STATES.WALKING;
            this.stateTimer = Math.random() * 3.5 + 2;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.targetX = clamp(this.x + this.direction * (Math.random() * 220 + 100), minX, maxX);
          } else {
            // If on a high platform:
            // Chance to leap down to ground floor!
            if (Math.random() < 0.4) {
              const groundTargetX = clamp(this.x + (Math.random() - 0.5) * 200, 100, bounds.width - 100);
              this.leapTo(groundTargetX, 530, null);
              break;
            }
            // Otherwise walk along platform
            this.state = CAT_STATES.WALKING;
            this.stateTimer = Math.random() * 2.5 + 1.5;
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.targetX = clamp(this.x + this.direction * (Math.random() * 80 + 40), minX, maxX);
          }
        }
        break;

      case CAT_STATES.WALKING:
        const dx = this.targetX - this.x;
        const targetVx = Math.sign(dx) * this.maxSpeed;
        this.vx = lerp(this.vx, targetVx, dt * this.accel);
        this.direction = Math.sign(this.vx) || this.direction;
        this.hopOffset = Math.abs(Math.sin(this.animTime * 9)) * 9;

        if (Math.abs(dx) < 10 || this.stateTimer <= 0) {
          this.state = CAT_STATES.IDLE;
          this.stateTimer = Math.random() * 2.2 + 1.2;
        }
        break;

      case CAT_STATES.HIDING:
        this.vx = 0;
        if (this.stateTimer <= 0) {
          this.state = CAT_STATES.PEEKING;
          this.stateTimer = 1.8;
        }
        this.peekFactor = Math.max(0, this.peekFactor - 4 * dt);
        break;

      case CAT_STATES.PEEKING:
        this.vx = 0;
        this.peekFactor = Math.min(1, this.peekFactor + 3.5 * dt);
        if (this.stateTimer <= 0) {
          if (Math.random() < 0.5) {
            this.isHiding = false;
            if (this.currentProp) {
              this.currentProp.clearHidingCat();
              this.currentProp = null;
            }
            this.state = CAT_STATES.WALKING;
            this.stateTimer = 3.0;
            this.targetX = clamp(this.x + (Math.random() > 0.5 ? 180 : -180), minX, maxX);
          } else {
            this.state = CAT_STATES.HIDING;
            this.stateTimer = Math.random() * 3 + 2;
          }
        }
        break;

      case CAT_STATES.SURPRISED:
        this.hopOffset = 26;
        this.vx = 0;
        if (this.stateTimer <= 0) {
          this.state = CAT_STATES.RUNNING;
          this.stateTimer = 2.4;
        }
        break;

      case CAT_STATES.RUNNING:
        const runSpeed = this.maxSpeed * 1.85;
        const rdx = this.targetX - this.x;
        const runTargetVx = Math.sign(rdx) * runSpeed;
        this.vx = lerp(this.vx, runTargetVx, dt * (this.accel * 1.5));
        this.direction = Math.sign(this.vx) || this.direction;
        this.hopOffset = Math.abs(Math.sin(this.animTime * 15)) * 14;

        if (Math.abs(rdx) < 12 || this.stateTimer <= 0) {
          this.state = CAT_STATES.IDLE;
          this.stateTimer = 2.0;
        }
        break;

      case CAT_STATES.CELEBRATING:
        this.vx = lerp(this.vx, 0, dt * this.accel);
        this.hopOffset = Math.abs(Math.sin(this.animTime * 12)) * 18;
        if (this.stateTimer <= 0) {
          this.state = CAT_STATES.IDLE;
          this.stateTimer = 2.0;
        }
        break;
    }

    this.x += this.vx * dt;
    this.x = clamp(this.x, minX, maxX);
    this.y = this.baseY - this.hopOffset - (this.peekFactor * 34);
  }

  isHittable() {
    if (this.state === CAT_STATES.HIDING && this.peekFactor < 0.35) {
      return false;
    }
    return true;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction * this.squashStretchX, this.squashStretchY);

    if (this.state === CAT_STATES.HIDING && this.peekFactor <= 0) {
      ctx.restore();
      return;
    }

    this.drawCat(ctx);

    ctx.restore();
  }

  drawCat(ctx) {
    const isFluffy = this.bodyType === 'extra_fluffy' || this.bodyType === 'giant';
    const isSlender = this.bodyType === 'slender';
    const r = this.radius;

    // 1. Tail (Behind)
    ctx.save();
    ctx.translate(-r * 0.65, r * 0.35);
    ctx.rotate(this.tailAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-22, -10, -28, -32, -14, -38);
    ctx.lineWidth = isFluffy ? 14 : (isSlender ? 6 : 9);
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.primaryColor;
    ctx.stroke();

    if (this.breedType === 'siamese') {
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    if (this.tintColor) {
      ctx.strokeStyle = hexToRgba(this.tintColor, 0.7);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Ears
    this.drawEars(ctx, r);

    // 3. Body
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    if (isFluffy) {
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.arc(-r * 0.75, r * 0.2, r * 0.45, 0, Math.PI * 2);
      ctx.arc(r * 0.75, r * 0.2, r * 0.45, 0, Math.PI * 2);
    } else if (isSlender) {
      ctx.ellipse(0, 0, r * 0.88, r * 0.82, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // 4. Distinct Breed Markings
    this.drawBreedMarkings(ctx, r);

    // Belly patch
    ctx.fillStyle = this.secondaryColor;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.38, r * 0.55, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bubble color tint overlay
    if (this.tintColor) {
      ctx.save();
      ctx.fillStyle = hexToRgba(this.tintColor, 0.65);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Cheeks
    ctx.fillStyle = 'rgba(255, 120, 140, 0.45)';
    ctx.beginPath();
    ctx.arc(-r * 0.5, r * 0.18, 6.5, 0, Math.PI * 2);
    ctx.arc(r * 0.5, r * 0.18, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Eyes
    this.drawEyes(ctx, r);

    // 7. Face
    this.drawFace(ctx, r);

    // 8. Paws
    ctx.fillStyle = this.breedType === 'siamese' ? '#3e2723' : this.secondaryColor;
    ctx.beginPath();
    ctx.ellipse(-r * 0.38, r * 0.75, 8, 5.5, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.38, r * 0.75, 8, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.state === CAT_STATES.SURPRISED) {
      ctx.fillStyle = '#ff4757';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', 0, -r - 14);
    }
  }

  drawEars(ctx, r) {
    ctx.fillStyle = this.breedType === 'siamese' ? '#3e2723' : this.primaryColor;

    if (this.earType === 'folded') {
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.5);
      ctx.quadraticCurveTo(-r * 0.75, -r * 0.8, -r * 0.45, -r * 0.9);
      ctx.quadraticCurveTo(-r * 0.2, -r * 0.75, -r * 0.15, -r * 0.55);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.15, -r * 0.55);
      ctx.quadraticCurveTo(r * 0.2, -r * 0.75, r * 0.45, -r * 0.9);
      ctx.quadraticCurveTo(r * 0.75, -r * 0.8, r * 0.6, -r * 0.5);
      ctx.fill();
    } else if (this.earType === 'huge_bat') {
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.35);
      ctx.lineTo(-r * 0.95, -r * 1.45);
      ctx.lineTo(-r * 0.15, -r * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.15, -r * 0.65);
      ctx.lineTo(r * 0.95, -r * 1.45);
      ctx.lineTo(r * 0.7, -r * 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffb8b8';
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.4);
      ctx.lineTo(-r * 0.85, -r * 1.3);
      ctx.lineTo(-r * 0.25, -r * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.25, -r * 0.6);
      ctx.lineTo(r * 0.85, -r * 1.3);
      ctx.lineTo(r * 0.6, -r * 0.4);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.4);
      ctx.lineTo(-r * 0.85, -r * 1.15);
      ctx.lineTo(-r * 0.2, -r * 0.7);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.2, -r * 0.7);
      ctx.lineTo(r * 0.85, -r * 1.15);
      ctx.lineTo(r * 0.7, -r * 0.4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffb8b8';
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.45);
      ctx.lineTo(-r * 0.72, -r * 0.98);
      ctx.lineTo(-r * 0.3, -r * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.3, -r * 0.65);
      ctx.lineTo(r * 0.72, -r * 0.98);
      ctx.lineTo(r * 0.55, -r * 0.45);
      ctx.closePath();
      ctx.fill();

      if (this.earType === 'lynx_tufted') {
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-r * 0.85, -r * 1.15);
        ctx.lineTo(-r * 0.95, -r * 1.32);
        ctx.moveTo(r * 0.85, -r * 1.15);
        ctx.lineTo(r * 0.95, -r * 1.32);
        ctx.stroke();
      }
    }
  }

  drawBreedMarkings(ctx, r) {
    if (this.breedType === 'siamese') {
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.breedType === 'bengal') {
      ctx.fillStyle = '#4e342e';
      const spots = [
        { x: -r * 0.55, y: -r * 0.1, s: 4 },
        { x: r * 0.55, y: -r * 0.1, s: 4.5 },
        { x: -r * 0.3, y: r * 0.35, s: 3.5 },
        { x: r * 0.3, y: r * 0.35, s: 4 },
        { x: 0, y: -r * 0.45, s: 3.5 }
      ];
      for (const sp of spots) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff9f43';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (this.breedType === 'calico') {
      ctx.fillStyle = '#ff6f00';
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.3, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(r * 0.4, -r * 0.25, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.breedType === 'tabby') {
      ctx.strokeStyle = this.stripesColor;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-7, -r * 0.55);
      ctx.lineTo(-3, -r * 0.4);
      ctx.lineTo(0, -r * 0.52);
      ctx.lineTo(3, -r * 0.4);
      ctx.lineTo(7, -r * 0.55);

      ctx.moveTo(-r * 0.65, 0);
      ctx.lineTo(-r * 0.4, -2);
      ctx.moveTo(-r * 0.65, 8);
      ctx.lineTo(-r * 0.42, 6);
      ctx.moveTo(r * 0.65, 0);
      ctx.lineTo(r * 0.4, -2);
      ctx.moveTo(r * 0.65, 8);
      ctx.lineTo(r * 0.42, 6);
      ctx.stroke();
    } else if (this.breedType === 'sphynx') {
      ctx.strokeStyle = '#e0a899';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, -r * 0.4, 8, Math.PI * 0.2, Math.PI * 0.8);
      ctx.arc(0, -r * 0.25, 12, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    }
  }

  drawEyes(ctx, r) {
    const eyeY = -r * 0.12;
    const eyeSpacing = r * 0.38;

    if (this.state === CAT_STATES.CELEBRATING) {
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 6.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(eyeSpacing, eyeY, 6.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else if (this.state === CAT_STATES.SURPRISED) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 8.5, 0, Math.PI * 2);
      ctx.arc(eyeSpacing, eyeY, 8.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.arc(-eyeSpacing, eyeY, 3.8, 0, Math.PI * 2);
      ctx.arc(eyeSpacing, eyeY, 3.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.isBlinking) {
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-eyeSpacing - 6, eyeY);
      ctx.lineTo(-eyeSpacing + 6, eyeY);
      ctx.moveTo(eyeSpacing - 6, eyeY);
      ctx.lineTo(eyeSpacing + 6, eyeY);
      ctx.stroke();
    } else {
      ctx.fillStyle = this.eyeColor;
      ctx.beginPath();
      ctx.ellipse(-eyeSpacing, eyeY, 6.5, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeSpacing, eyeY, 6.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.ellipse(-eyeSpacing, eyeY, 3.2, 5.5, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeSpacing, eyeY, 3.2, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-eyeSpacing - 2, eyeY - 2.8, 2.4, 0, Math.PI * 2);
      ctx.arc(eyeSpacing - 2, eyeY - 2.8, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-eyeSpacing + 2, eyeY + 1.8, 1.2, 0, Math.PI * 2);
      ctx.arc(eyeSpacing + 2, eyeY + 1.8, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFace(ctx, r) {
    const noseY = r * 0.08;

    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.moveTo(0, noseY + 2);
    ctx.lineTo(-3.5, noseY - 2);
    ctx.lineTo(3.5, noseY - 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-3.5, noseY + 3);
    ctx.quadraticCurveTo(-1.8, noseY + 6.5, 0, noseY + 4);
    ctx.quadraticCurveTo(1.8, noseY + 6.5, 3.5, noseY + 3);
    ctx.stroke();

    const whiskerLen = this.breedType === 'sphynx' ? 10 : (this.breedType === 'maine_coon' ? 24 : 18);
    ctx.strokeStyle = '#485460';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.35, noseY + 2);
    ctx.lineTo(-r * 0.35 - whiskerLen, noseY - 1);
    ctx.moveTo(-r * 0.35, noseY + 5);
    ctx.lineTo(-r * 0.35 - whiskerLen, noseY + 6);

    ctx.moveTo(r * 0.35, noseY + 2);
    ctx.lineTo(r * 0.35 + whiskerLen, noseY - 1);
    ctx.moveTo(r * 0.35, noseY + 5);
    ctx.lineTo(r * 0.35 + whiskerLen, noseY + 6);
    ctx.stroke();
  }
}
