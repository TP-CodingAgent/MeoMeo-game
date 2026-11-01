/**
 * Cute Cat Bubble Shooter - Interactive Props & Elevated Furniture
 * Props (sofa, cardboard box, plant, wall shelf, wardrobe, tree branch, clothesline)
 * wobble elastically with spring physics, record paint splats, and startle hidden/perched cats.
 */

import { springUpdate, isPointInAABB } from '../utils/math-physics.js';

export class Prop {
  constructor(config = {}) {
    this.id = config.id || 'prop_' + Math.random().toString(36).substr(2, 6);
    this.type = config.type || 'box'; // 'sofa', 'box', 'plant', 'fence', 'cushion', 'bush', 'shelf', 'wardrobe', 'branch', 'clothesline'
    this.x = config.x || 200;
    this.y = config.y || 400;
    this.width = config.width || 120;
    this.height = config.height || 90;
    this.label = config.label || 'Prop';
    this.isPlatform = config.isPlatform || false; // Can cats stand/walk on top?
    this.hidingCat = null;

    // Spring oscillation
    this.wobbleX = 0;
    this.wobbleY = 0;
    this.wobbleRot = 0;
    this.vx = 0;
    this.vy = 0;
    this.vRot = 0;

    // Paint splatters
    this.splats = [];
  }

  setHidingCat(cat) {
    this.hidingCat = cat;
  }

  clearHidingCat() {
    this.hidingCat = null;
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  containsPoint(px, py) {
    const b = this.getBounds();
    return isPointInAABB(px, py, b.x, b.y, b.width, b.height);
  }

  onHit(bubbleX, bubbleY, bubbleColor, particlePool, audioManager) {
    const relX = (bubbleX - this.x) / (this.width / 2);
    this.vx += relX * 180;
    this.vy += 70;
    this.vRot += (relX > 0 ? 0.22 : -0.22);

    this.splats.push({
      localX: bubbleX - this.x,
      localY: bubbleY - this.y,
      color: bubbleColor,
      radius: Math.random() * 8 + 8,
      life: 5.0,
      maxLife: 5.0
    });
    if (this.splats.length > 8) {
      this.splats.shift();
    }

    if (audioManager) {
      audioManager.playThump();
    }

    // Startle hidden cat if any
    if (this.hidingCat && this.hidingCat.isHiding) {
      const startledCat = this.hidingCat;
      this.clearHidingCat();
      startledCat.startle(this.x, this.y);
      if (particlePool) {
        particlePool.burst(this.x, this.y - this.height * 0.4, '#ffd166', 8, 'star');
      }
    }
  }

  update(dt) {
    const sX = springUpdate(this.wobbleX, this.vx, 0, 240, 18, dt);
    this.wobbleX = sX.pos;
    this.vx = sX.vel;

    const sY = springUpdate(this.wobbleY, this.vy, 0, 220, 16, dt);
    this.wobbleY = sY.pos;
    this.vy = sY.vel;

    const sRot = springUpdate(this.wobbleRot, this.vRot, 0, 260, 20, dt);
    this.wobbleRot = sRot.pos;
    this.vRot = sRot.vel;

    for (let i = this.splats.length - 1; i >= 0; i--) {
      this.splats[i].life -= dt;
      if (this.splats[i].life <= 0) {
        this.splats.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x + this.wobbleX, this.y + this.wobbleY);
    ctx.rotate(this.wobbleRot);

    const hw = this.width / 2;
    const hh = this.height / 2;

    switch (this.type) {
      case 'sofa':
        this.drawSofa(ctx, hw, hh);
        break;
      case 'box':
        this.drawBox(ctx, hw, hh);
        break;
      case 'plant':
        this.drawPlant(ctx, hw, hh);
        break;
      case 'fence':
        this.drawFence(ctx, hw, hh);
        break;
      case 'cushion':
        this.drawCushion(ctx, hw, hh);
        break;
      case 'bush':
        this.drawBush(ctx, hw, hh);
        break;
      case 'shelf':
        this.drawShelf(ctx, hw, hh);
        break;
      case 'wardrobe':
        this.drawWardrobe(ctx, hw, hh);
        break;
      case 'branch':
        this.drawBranch(ctx, hw, hh);
        break;
      case 'clothesline':
        this.drawClothesline(ctx, hw, hh);
        break;
      case 'palm_tree':
        this.drawPalmTree(ctx, hw, hh);
        break;
      case 'hammock':
        this.drawHammock(ctx, hw, hh);
        break;
      case 'beach_umbrella':
        this.drawBeachUmbrella(ctx, hw, hh);
        break;
      case 'sandcastle':
        this.drawSandcastle(ctx, hw, hh);
        break;
      case 'beach_chair':
        this.drawBeachChair(ctx, hw, hh);
        break;
      case 'coral_rock':
        this.drawCoralRock(ctx, hw, hh);
        break;
      case 'sunken_ship':
        this.drawSunkenShip(ctx, hw, hh);
        break;
      case 'treasure_chest':
        this.drawTreasureChest(ctx, hw, hh);
        break;
      case 'seaweed':
        this.drawSeaweed(ctx, hw, hh);
        break;
      case 'clam_shell':
        this.drawClamShell(ctx, hw, hh);
        break;
      case 'flying_carpet':
        this.drawFlyingCarpet(ctx, hw, hh);
        break;
      case 'desert_arch':
        this.drawDesertArch(ctx, hw, hh);
        break;
      case 'cactus':
        this.drawCactus(ctx, hw, hh);
        break;
      case 'oasis_tent':
        this.drawOasisTent(ctx, hw, hh);
        break;
      case 'water_jug':
        this.drawWaterJug(ctx, hw, hh);
        break;
      case 'space_platform':
        this.drawSpacePlatform(ctx, hw, hh);
        break;
      case 'satellite':
        this.drawSatellite(ctx, hw, hh);
        break;
      case 'mini_ufo':
        this.drawMiniUfo(ctx, hw, hh);
        break;
      case 'lunar_rover':
        this.drawLunarRover(ctx, hw, hh);
        break;
      case 'space_crate':
        this.drawSpaceCrate(ctx, hw, hh);
        break;
      case 'ice_shelf':
        this.drawIceShelf(ctx, hw, hh);
        break;
      case 'snow_pinnacle':
        this.drawSnowPinnacle(ctx, hw, hh);
        break;
      case 'snowman':
        this.drawSnowman(ctx, hw, hh);
        break;
      case 'igloo':
        this.drawIgloo(ctx, hw, hh);
        break;
      case 'pine_tree':
        this.drawPineTree(ctx, hw, hh);
        break;
      default:
        this.drawBox(ctx, hw, hh);
        break;
    }

    this.renderSplats(ctx);

    ctx.restore();
  }

  renderSplats(ctx) {
    for (const splat of this.splats) {
      const alpha = Math.max(0, splat.life / splat.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = splat.color;
      ctx.beginPath();
      ctx.arc(splat.localX, splat.localY, splat.radius, 0, Math.PI * 2);
      ctx.fill();

      // splat drips
      ctx.beginPath();
      ctx.arc(splat.localX + splat.radius * 0.55, splat.localY + splat.radius * 0.45, splat.radius * 0.32, 0, Math.PI * 2);
      ctx.arc(splat.localX - splat.radius * 0.5, splat.localY + splat.radius * 0.38, splat.radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawSofa(ctx, hw, hh) {
    ctx.fillStyle = '#f3a683';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh + 15, hw * 2, hh * 2 - 15, 16);
    ctx.fill();

    ctx.fillStyle = '#e77f67';
    ctx.beginPath();
    ctx.roundRect(-hw + 8, -hh, hw * 2 - 16, hh * 1.1, 14);
    ctx.fill();

    ctx.fillStyle = '#f8a5c2';
    ctx.beginPath();
    ctx.roundRect(-hw + 14, 0, hw - 18, hh - 10, 10);
    ctx.roundRect(4, 0, hw - 18, hh - 10, 10);
    ctx.fill();

    ctx.fillStyle = '#cf6a4c';
    ctx.beginPath();
    ctx.roundRect(-hw - 6, -hh + 20, 18, hh * 2 - 24, 8);
    ctx.roundRect(hw - 12, -hh + 20, 18, hh * 2 - 24, 8);
    ctx.fill();
  }

  drawBox(ctx, hw, hh) {
    ctx.fillStyle = '#d1a054';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh + 10, hw * 2, hh * 2 - 10, 8);
    ctx.fill();

    ctx.fillStyle = '#b98842';
    ctx.beginPath();
    ctx.moveTo(-hw, -hh + 10);
    ctx.lineTo(-hw - 10, -hh - 8);
    ctx.lineTo(0, -hh - 2);
    ctx.lineTo(0, -hh + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#a87a38';
    ctx.beginPath();
    ctx.moveTo(0, -hh + 10);
    ctx.lineTo(0, -hh - 2);
    ctx.lineTo(hw + 10, -hh - 8);
    ctx.lineTo(hw, -hh + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 10, 12, 0, Math.PI * 2);
    ctx.fill();
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(i * 10, -6, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlant(ctx, hw, hh) {
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.6, hh);
    ctx.lineTo(-hw * 0.8, -hh * 0.2);
    ctx.lineTo(hw * 0.8, -hh * 0.2);
    ctx.lineTo(hw * 0.6, hh);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.9, -hh * 0.35, hw * 1.8, hh * 0.25, 4);
    ctx.fill();

    ctx.fillStyle = '#00b894';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.6, hw * 0.65, 0, Math.PI * 2);
    ctx.arc(-hw * 0.45, -hh * 0.4, hw * 0.45, 0, Math.PI * 2);
    ctx.arc(hw * 0.45, -hh * 0.4, hw * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#55efc4';
    ctx.beginPath();
    ctx.arc(-8, -hh * 0.7, hw * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFence(ctx, hw, hh) {
    const palings = 5;
    const step = (hw * 2) / palings;
    ctx.fillStyle = '#fab1a0';
    for (let i = 0; i < palings; i++) {
      const px = -hw + i * step + 4;
      ctx.beginPath();
      ctx.moveTo(px, hh);
      ctx.lineTo(px, -hh + 12);
      ctx.lineTo(px + (step - 8) / 2, -hh);
      ctx.lineTo(px + step - 8, -hh + 12);
      ctx.lineTo(px + step - 8, hh);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#e17055';
    ctx.fillRect(-hw, -hh * 0.3, hw * 2, 10);
    ctx.fillRect(-hw, hh * 0.4, hw * 2, 10);
  }

  drawCushion(ctx, hw, hh) {
    ctx.fillStyle = '#a29bfe';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 20);
    ctx.fill();

    ctx.fillStyle = '#6c5ce7';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBush(ctx, hw, hh) {
    ctx.fillStyle = '#26de81';
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.75, 0, Math.PI * 2);
    ctx.arc(-hw * 0.45, 10, hw * 0.55, 0, Math.PI * 2);
    ctx.arc(hw * 0.45, 10, hw * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fd79a8';
    ctx.beginPath();
    ctx.arc(-hw * 0.3, -hh * 0.2, 7, 0, Math.PI * 2);
    ctx.arc(hw * 0.35, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  drawShelf(ctx, hw, hh) {
    // Wall Shelf wooden board
    ctx.fillStyle = '#d4a373';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 6);
    ctx.fill();
    ctx.strokeStyle = '#bc6c25';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Steel shelf wall brackets
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(-hw + 24, hh, 8, 18);
    ctx.fillRect(hw - 32, hh, 8, 18);

    // Books on the left of shelf
    const bookColors = ['#e63946', '#457b9d', '#2a9d8f'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = bookColors[i];
      ctx.fillRect(-hw + 14 + i * 14, -hh - 32, 11, 32);
    }
  }

  drawWardrobe(ctx, hw, hh) {
    // Tall Wardrobe body
    ctx.fillStyle = '#d7ccc8';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 10);
    ctx.fill();
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Wardrobe doors & division line
    ctx.beginPath();
    ctx.moveTo(0, -hh + 8);
    ctx.lineTo(0, hh - 8);
    ctx.stroke();

    // Golden door handles
    ctx.fillStyle = '#fbc531';
    ctx.beginPath();
    ctx.arc(-14, 0, 5, 0, Math.PI * 2);
    ctx.arc(14, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBranch(ctx, hw, hh) {
    // Sturdy wooden branch
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(-hw, hh * 0.2);
    ctx.quadraticCurveTo(0, -hh * 0.4, hw, 0);
    ctx.lineTo(hw, hh);
    ctx.quadraticCurveTo(0, hh * 0.6, -hw, hh);
    ctx.closePath();
    ctx.fill();

    // Lush green leaves cluster
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(-hw * 0.4, -hh * 0.6, 26, 0, Math.PI * 2);
    ctx.arc(hw * 0.2, -hh * 0.5, 30, 0, Math.PI * 2);
    ctx.arc(hw * 0.7, -hh * 0.3, 22, 0, Math.PI * 2);
    ctx.fill();

    // Red apple
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(hw * 0.1, hh * 0.2, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  drawClothesline(ctx, hw, hh) {
    // Hanging wire
    ctx.strokeStyle = '#747d8c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-hw, -hh * 0.4);
    ctx.quadraticCurveTo(0, hh * 0.6, hw, -hh * 0.4);
    ctx.stroke();

    // Hanging colorful towels & socks
    const items = [
      { x: -hw * 0.5, color: '#ff6b81', w: 32, h: 42 },
      { x: -hw * 0.05, color: '#70a1ff', w: 28, h: 36 },
      { x: hw * 0.4, color: '#eccc68', w: 34, h: 44 }
    ];

    for (const item of items) {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.roundRect(item.x - item.w / 2, 0, item.w, item.h, 4);
      ctx.fill();

      // Clothes pegs / clips
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(item.x - 7, -5, 4, 9);
      ctx.fillRect(item.x + 3, -5, 4, 9);
    }
  }

  // --- 1. Tropical Beach Props ---
  drawPalmTree(ctx, hw, hh) {
    // Curved trunk
    ctx.fillStyle = '#a0522d';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.2, hh);
    ctx.quadraticCurveTo(-hw * 0.5, 0, -hw * 0.1, -hh * 0.2);
    ctx.lineTo(hw * 0.1, -hh * 0.2);
    ctx.quadraticCurveTo(-hw * 0.3, 0, 0, hh);
    ctx.closePath();
    ctx.fill();

    // Palm leaves cluster (forms platform top)
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.ellipse(-hw * 0.3, -hh * 0.4, hw * 0.65, hh * 0.5, -0.2, 0, Math.PI * 2);
    ctx.ellipse(hw * 0.3, -hh * 0.4, hw * 0.65, hh * 0.5, 0.2, 0, Math.PI * 2);
    ctx.ellipse(0, -hh * 0.55, hw * 0.75, hh * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bright green leaf highlights
    ctx.fillStyle = '#7bed9f';
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.6, hw * 0.5, hh * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coconuts
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.arc(-8, -hh * 0.15, 8, 0, Math.PI * 2);
    ctx.arc(8, -hh * 0.15, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHammock(ctx, hw, hh) {
    // Wooden posts
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-hw, -hh * 0.6, 12, hh * 1.6);
    ctx.fillRect(hw - 12, -hh * 0.6, 12, hh * 1.6);

    // Hanging striped hammock canvas
    ctx.fillStyle = '#ff6b81';
    ctx.beginPath();
    ctx.moveTo(-hw + 12, -hh * 0.2);
    ctx.quadraticCurveTo(0, hh * 0.8, hw - 12, -hh * 0.2);
    ctx.quadraticCurveTo(0, hh * 0.4, -hw + 12, -hh * 0.2);
    ctx.fill();

    // Yellow stripe
    ctx.fillStyle = '#feca57';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.6, 0);
    ctx.quadraticCurveTo(0, hh * 0.6, hw * 0.6, 0);
    ctx.quadraticCurveTo(0, hh * 0.45, -hw * 0.6, 0);
    ctx.fill();
  }

  drawBeachUmbrella(ctx, hw, hh) {
    // Metal pole
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(-3, -hh * 0.4, 6, hh * 1.4);

    // Umbrella canopy
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.3, hw * 0.9, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // White stripes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.45, -hh * 0.3);
    ctx.lineTo(0, -hh * 0.3 - hw * 0.9);
    ctx.lineTo(-hw * 0.15, -hh * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(hw * 0.15, -hh * 0.3);
    ctx.lineTo(0, -hh * 0.3 - hw * 0.9);
    ctx.lineTo(hw * 0.45, -hh * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  drawSandcastle(ctx, hw, hh) {
    ctx.fillStyle = '#f5cd79';
    // Center tower
    ctx.fillRect(-hw * 0.45, -hh * 0.6, hw * 0.9, hh * 1.6);
    // Left & right turrets
    ctx.fillRect(-hw * 0.9, -hh * 0.3, hw * 0.4, hh * 1.3);
    ctx.fillRect(hw * 0.5, -hh * 0.3, hw * 0.4, hh * 1.3);

    // Battlements
    ctx.fillStyle = '#eccc68';
    ctx.fillRect(-hw * 0.45, -hh * 0.75, 12, 10);
    ctx.fillRect(-hw * 0.1, -hh * 0.75, 12, 10);
    ctx.fillRect(hw * 0.25, -hh * 0.75, 12, 10);

    // Cute seashell door
    ctx.fillStyle = '#ff9ff3';
    ctx.beginPath();
    ctx.arc(0, hh * 0.6, 16, Math.PI, 0);
    ctx.fill();

    // Red flag
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.75);
    ctx.lineTo(18, -hh * 0.65);
    ctx.lineTo(0, -hh * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  drawBeachChair(ctx, hw, hh) {
    // Reclining wooden frame
    ctx.strokeStyle = '#d35400';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.8, hh * 0.6);
    ctx.lineTo(hw * 0.2, -hh * 0.5);
    ctx.lineTo(hw * 0.8, hh * 0.6);
    ctx.stroke();

    // Striped fabric
    ctx.fillStyle = '#54a0ff';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.7, -hh * 0.2, hw * 1.4, hh * 0.45, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-hw * 0.2, -hh * 0.2, 14, hh * 0.45);
  }

  // --- 2. Deep Ocean Props ---
  drawCoralRock(ctx, hw, hh) {
    // Bioluminescent coral shelf platform
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh * 0.5, this.width, hh * 0.9, 14);
    ctx.fill();

    // Glowing coral branches
    ctx.fillStyle = '#ff6b81';
    for (let i = -hw * 0.7; i <= hw * 0.7; i += 30) {
      ctx.beginPath();
      ctx.arc(i, -hh * 0.5, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cyan glowing spores
    ctx.fillStyle = '#1dd1a1';
    ctx.beginPath();
    ctx.arc(-hw * 0.3, -hh * 0.2, 5, 0, Math.PI * 2);
    ctx.arc(hw * 0.2, -hh * 0.1, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSunkenShip(ctx, hw, hh) {
    // Weathered ship deck platform
    ctx.fillStyle = '#4b382a';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh * 0.5, this.width, hh * 0.85, 8);
    ctx.fill();

    // Deck planks
    ctx.strokeStyle = '#2d1f14';
    ctx.lineWidth = 2;
    for (let x = -hw + 25; x < hw; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, -hh * 0.5);
      ctx.lineTo(x, hh * 0.35);
      ctx.stroke();
    }

    // Brass ship wheel
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -hh * 0.5, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawTreasureChest(ctx, hw, hh) {
    // Wooden chest body
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.8, -hh * 0.4, hw * 1.6, hh * 1.2, 8);
    ctx.fill();

    // Curved lid
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.3, hw * 0.8, Math.PI, 0);
    ctx.fill();

    // Gold trim & lock
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(-hw * 0.75, -hh * 0.2, hw * 1.5, 6);
    ctx.beginPath();
    ctx.arc(0, hh * 0.1, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing gems spilling out
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(-14, -hh * 0.35, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(12, -hh * 0.38, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSeaweed(ctx, hw, hh) {
    ctx.fillStyle = '#10ac84';
    const blades = [-hw * 0.5, -hw * 0.1, hw * 0.3, hw * 0.6];
    for (const bx of blades) {
      ctx.beginPath();
      ctx.moveTo(bx, hh);
      ctx.quadraticCurveTo(bx - 18, 0, bx, -hh * 0.8);
      ctx.quadraticCurveTo(bx + 14, 0, bx + 10, hh);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawClamShell(ctx, hw, hh) {
    // Open scallop shell
    ctx.fillStyle = '#ff9ff3';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.2, hw * 0.8, hh * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top shell lid
    ctx.fillStyle = '#f368e0';
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.3, hw * 0.75, hh * 0.45, 0, Math.PI, 0);
    ctx.fill();

    // Big iridescent pearl
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, hh * 0.1, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#54a0ff';
    ctx.beginPath();
    ctx.arc(-4, hh * 0.05, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 3. Sunset Desert Props ---
  drawFlyingCarpet(ctx, hw, hh) {
    // Hovering Persian carpet platform
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh * 0.5, this.width, hh * 0.8, 12);
    ctx.fill();

    // Ornate gold border & patterns
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.strokeRect(-hw + 8, -hh * 0.5 + 4, this.width - 16, hh * 0.8 - 8);

    // Gold tassels at corners
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(-hw + 4, hh * 0.35, 6, 0, Math.PI * 2);
    ctx.arc(hw - 4, hh * 0.35, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDesertArch(ctx, hw, hh) {
    // Sandstone ancient columns & arch platform
    ctx.fillStyle = '#d35400';
    ctx.fillRect(-hw, -hh * 0.6, this.width, 22); // Top beam platform
    ctx.fillRect(-hw + 8, -hh * 0.6, 26, hh * 1.6); // Left pillar
    ctx.fillRect(hw - 34, -hh * 0.6, 26, hh * 1.6); // Right pillar

    // Carved hieroglyphs
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(-hw * 0.5, -hh * 0.5, hw, 8);
  }

  drawCactus(ctx, hw, hh) {
    // Chubby green saguaro
    ctx.fillStyle = '#27ae60';
    // Center trunk
    ctx.beginPath();
    ctx.roundRect(-hw * 0.3, -hh * 0.8, hw * 0.6, hh * 1.8, 16);
    ctx.fill();

    // Left arm
    ctx.beginPath();
    ctx.roundRect(-hw * 0.8, -hh * 0.3, hw * 0.45, 14, 6);
    ctx.roundRect(-hw * 0.8, -hh * 0.6, 14, hh * 0.5, 6);
    ctx.fill();

    // Right arm
    ctx.beginPath();
    ctx.roundRect(hw * 0.35, -hh * 0.1, hw * 0.45, 14, 6);
    ctx.roundRect(hw * 0.65, -hh * 0.45, 14, hh * 0.5, 6);
    ctx.fill();

    // Pink flower on top
    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.85, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawOasisTent(ctx, hw, hh) {
    // Nomad triangular striped tent
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.8);
    ctx.lineTo(-hw * 0.85, hh);
    ctx.lineTo(hw * 0.85, hh);
    ctx.closePath();
    ctx.fill();

    // Yellow center awning
    ctx.fillStyle = '#feca57';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.8);
    ctx.lineTo(-hw * 0.25, hh);
    ctx.lineTo(hw * 0.25, hh);
    ctx.closePath();
    ctx.fill();

    // Tent entrance slit
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.1);
    ctx.lineTo(-12, hh);
    ctx.lineTo(12, hh);
    ctx.closePath();
    ctx.fill();
  }

  drawWaterJug(ctx, hw, hh) {
    // Terracotta pitcher
    ctx.fillStyle = '#d35400';
    ctx.beginPath();
    ctx.arc(0, hh * 0.1, hw * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-hw * 0.3, -hh * 0.7, hw * 0.6, hh * 0.6);

    // Decorative blue wave stripe
    ctx.fillStyle = '#0984e3';
    ctx.fillRect(-hw * 0.45, hh * 0.05, hw * 0.9, 8);
  }

  // --- 4. Cosmic Space Props ---
  drawSpacePlatform(ctx, hw, hh) {
    // Sci-fi metallic orbital platform
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh * 0.5, this.width, hh * 0.85, 8);
    ctx.fill();

    // Glowing cyan neon strip
    ctx.fillStyle = '#00d2d3';
    ctx.fillRect(-hw + 8, -hh * 0.45, this.width - 16, 6);

    // Tech bolts
    ctx.fillStyle = '#747d8c';
    for (let x = -hw + 15; x < hw; x += 30) {
      ctx.beginPath();
      ctx.arc(x, hh * 0.15, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawSatellite(ctx, hw, hh) {
    // Hexagonal gold/silver satellite body
    ctx.fillStyle = '#dfe4ea';
    ctx.fillRect(-hw * 0.25, -hh * 0.6, hw * 0.5, hh * 1.2);

    // Solar panel wings (platform surface)
    ctx.fillStyle = '#1e3799';
    ctx.fillRect(-hw, -hh * 0.45, hw * 0.7, hh * 0.85);
    ctx.fillRect(hw * 0.3, -hh * 0.45, hw * 0.7, hh * 0.85);

    // Solar grid lines
    ctx.strokeStyle = '#00d2d3';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-hw, -hh * 0.45, hw * 0.7, hh * 0.85);
    ctx.strokeRect(hw * 0.3, -hh * 0.45, hw * 0.7, hh * 0.85);
  }

  drawMiniUfo(ctx, hw, hh) {
    // Silver saucer
    ctx.fillStyle = '#a4b0be';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.1, hw * 0.85, hh * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glass cockpit bubble
    ctx.fillStyle = 'rgba(0, 210, 211, 0.75)';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.1, hw * 0.45, Math.PI, 0);
    ctx.fill();

    // Multi-color rim lights
    const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(-hw * 0.6 + i * (hw * 0.4), hh * 0.15, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLunarRover(ctx, hw, hh) {
    // Buggy chassis
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.7, -hh * 0.4, hw * 1.4, hh * 0.7, 8);
    ctx.fill();

    // Big tires
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.arc(-hw * 0.45, hh * 0.5, 14, 0, Math.PI * 2);
    ctx.arc(hw * 0.45, hh * 0.5, 14, 0, Math.PI * 2);
    ctx.fill();

    // Radar dish
    ctx.fillStyle = '#ffa502';
    ctx.beginPath();
    ctx.arc(0, -hh * 0.55, 10, 0, Math.PI);
    ctx.fill();
  }

  drawSpaceCrate(ctx, hw, hh) {
    ctx.fillStyle = '#3742fa';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.8, -hh * 0.7, hw * 1.6, hh * 1.5, 8);
    ctx.fill();

    // Glowing core logo
    ctx.fillStyle = '#00d2d3';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 5. Frozen Arctic Props ---
  drawIceShelf(ctx, hw, hh) {
    // Translucent crystal ice platform
    ctx.fillStyle = '#70a1ff';
    ctx.beginPath();
    ctx.roundRect(-hw, -hh * 0.5, this.width, hh * 0.8, 10);
    ctx.fill();

    // Glistening white ice top
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-hw + 4, -hh * 0.5, this.width - 8, 5);

    // Hanging icicles
    ctx.fillStyle = '#a4b0be';
    for (let x = -hw + 15; x < hw; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, hh * 0.3);
      ctx.lineTo(x + 5, hh * 0.3 + 12);
      ctx.lineTo(x + 10, hh * 0.3);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawSnowPinnacle(ctx, hw, hh) {
    // Ice castle battlement platform
    ctx.fillStyle = '#5352ed';
    ctx.fillRect(-hw, -hh * 0.5, this.width, 22);

    // Spire
    ctx.fillStyle = '#70a1ff';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.9);
    ctx.lineTo(-hw * 0.35, -hh * 0.5);
    ctx.lineTo(hw * 0.35, -hh * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  drawSnowman(ctx, hw, hh) {
    // Bottom snowball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, hh * 0.35, hw * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Top snowball (head)
    ctx.beginPath();
    ctx.arc(0, -hh * 0.25, hw * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Carrot nose
    ctx.fillStyle = '#ff7f50';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.25);
    ctx.lineTo(16, -hh * 0.22);
    ctx.lineTo(0, -hh * 0.18);
    ctx.closePath();
    ctx.fill();

    // Coal eyes
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.arc(-6, -hh * 0.32, 2.5, 0, Math.PI * 2);
    ctx.arc(6, -hh * 0.32, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Red woolen muffler / scarf
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.roundRect(-hw * 0.4, -hh * 0.05, hw * 0.8, 10, 4);
    ctx.fill();
    ctx.fillRect(8, 0, 10, 18);
  }

  drawIgloo(ctx, hw, hh) {
    // Dome igloo
    ctx.fillStyle = '#f1f2f6';
    ctx.beginPath();
    ctx.arc(0, hh * 0.6, hw * 0.85, Math.PI, 0);
    ctx.fill();

    // Blue ice block seams
    ctx.strokeStyle = '#70a1ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, hh * 0.6, hw * 0.6, Math.PI, 0);
    ctx.stroke();

    // Cozy entrance
    ctx.fillStyle = '#57606f';
    ctx.beginPath();
    ctx.arc(0, hh * 0.6, 18, Math.PI, 0);
    ctx.fill();
  }

  drawPineTree(ctx, hw, hh) {
    // Brown trunk
    ctx.fillStyle = '#795548';
    ctx.fillRect(-10, hh * 0.4, 20, hh * 0.6);

    // Layered green pine foliage
    ctx.fillStyle = '#2ed573';
    // Bottom layer
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.2);
    ctx.lineTo(-hw * 0.8, hh * 0.4);
    ctx.lineTo(hw * 0.8, hh * 0.4);
    ctx.closePath();
    ctx.fill();

    // Top layer
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.8);
    ctx.lineTo(-hw * 0.55, -hh * 0.1);
    ctx.lineTo(hw * 0.55, -hh * 0.1);
    ctx.closePath();
    ctx.fill();

    // Snow caps on branches
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.1, hw * 0.5, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(0, hh * 0.38, hw * 0.75, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
