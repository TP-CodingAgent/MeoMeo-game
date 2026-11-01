/**
 * TP, T-P: Cute Cat Bubble Shooter - Bubble Entity & Pool
 * Represents soap bubbles shot from the First-Person blaster with
 * ceiling rebound bounce physics (bouncing off top edge, dropping 20-30%, then popping),
 * 3D perspective depth scaling, and multi-shape bubble rendering.
 */

import { hexToRgba, distance, lerp } from '../utils/math-physics.js';

export class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.totalDist = 1;
    this.scale = 1.0;
    this.radius = 20;
    this.baseRadius = 20;
    this.colorHex = '#ff6b8b';
    this.shape = 'circle';
    this.life = 0;
    this.maxLife = 3.5;
    this.alive = false;
    this.wobblePhase = 0;
    this.wobbleSpeed = 8;

    // Ceiling rebound bounce physics
    this.hasBouncedCeiling = false;
    this.ceilingDropTargetY = 0;
  }

  // T-P: Spawn Bubble
  spawn(x, y, vx, vy, colorHex, radius = 20, shape = 'circle', targetX = 0, targetY = 0) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.totalDist = distance(x, y, targetX, targetY) || 1;
    this.vx = vx;
    this.vy = vy;
    this.colorHex = colorHex || '#ff6b8b';
    this.baseRadius = radius;
    this.radius = radius;
    this.shape = shape || 'circle';
    this.maxLife = 3.5;
    this.life = this.maxLife;
    this.alive = true;
    this.scale = 1.25;
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 6 + Math.random() * 4;

    this.hasBouncedCeiling = false;
    this.ceilingDropTargetY = 0;
  }

  update(dt, bounds = { width: 1280, height: 720 }, particlePool = null) {
    if (!this.alive) return;

    this.life -= dt;
    if (this.life <= 0) {
      this.pop(particlePool);
      return;
    }

    // Perspective depth: shrinks from 1.25 down to 0.85
    const traveled = distance(this.startX, this.startY, this.x, this.y);
    const progress = Math.min(1.0, traveled / this.totalDist);
    this.scale = lerp(1.25, 0.85, progress);
    this.radius = this.baseRadius * this.scale;

    // Ceiling Rebound Physics (Bắn trúng trần nhà bật nhẹ lại rơi xuống 20-30% rồi vỡ tan)
    if (!this.hasBouncedCeiling && this.y - this.radius <= 6) {
      this.hasBouncedCeiling = true;
      this.y = 6 + this.radius;
      // Rebound downward gently (20-30% drop distance before popping)
      this.vy = Math.abs(this.vy) * 0.35 + 90;
      this.vx *= 0.55;
      this.ceilingDropTargetY = this.y + (bounds.height * (0.2 + Math.random() * 0.1)); // drops 20-30% of screen height
      if (particlePool) {
        particlePool.burst(this.x, this.y, this.colorHex, 4, 'droplet');
      }
    }

    // TP: Ceiling Rebound Physics
    if (this.hasBouncedCeiling) {
      // Gentle gravity as it floats downward
      this.vy += 180 * dt;
      // If it has fallen down 20-30% of the screen height, pop!
      if (this.y >= this.ceilingDropTargetY) {
        this.pop(particlePool);
        return;
      }
    } else {
      this.vx *= Math.pow(0.988, dt * 60);
      this.vy *= Math.pow(0.988, dt * 60);
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.wobblePhase += this.wobbleSpeed * dt;

    // Bounce gently off left/right screen edges
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * 0.7;
    } else if (this.x + this.radius > bounds.width) {
      this.x = bounds.width - this.radius;
      this.vx = -this.vx * 0.7;
    }

    // Out of bottom bounds
    if (this.y > bounds.height + 60) {
      this.alive = false;
    }
  }

  pop(particlePool) {
    if (!this.alive) return;
    this.alive = false;

    if (particlePool) {
      const burstType = this.shape === 'heart' ? 'heart' : (this.shape === 'star' ? 'star' : 'droplet');
      particlePool.burst(this.x, this.y, this.colorHex, 12, burstType);
      particlePool.spawn(this.x, this.y, '#ffffff', 'star', { radius: 6 * this.scale, speed: 90 });
    }
  }

  // TP: Pop Bubble
  render(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const wobbleX = (1 + Math.sin(this.wobblePhase) * 0.08) * this.scale;
    const wobbleY = (1 + Math.cos(this.wobblePhase) * 0.08) * this.scale;
    ctx.scale(wobbleX, wobbleY);

    const r = this.baseRadius;

    const gradient = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(0.35, hexToRgba(this.colorHex, 0.35));
    gradient.addColorStop(0.85, hexToRgba(this.colorHex, 0.65));
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.85)');

    ctx.fillStyle = gradient;
    ctx.strokeStyle = hexToRgba(this.colorHex, 0.95);
    ctx.lineWidth = 2.0;

    switch (this.shape) {
      case 'heart':
        this.drawHeartShape(ctx, r);
        break;
      case 'star':
        this.drawStarShape(ctx, r);
        break;
      case 'paw':
        this.drawPawShape(ctx, r);
        break;
      case 'apple':
        this.drawAppleShape(ctx, r);
        break;
      case 'cupcake':
        this.drawCupcakeShape(ctx, r);
        break;
      case 'crown':
        this.drawCrownShape(ctx, r);
        break;
      case 'diamond':
        this.drawDiamondShape(ctx, r);
        break;
      case 'circle':
      default:
        this.drawCircleShape(ctx, r);
        break;
    }

    ctx.restore();
  }

  drawCircleShape(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-r * 0.38, -r * 0.38, r * 0.32, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  drawHeartShape(ctx, r) {
    ctx.beginPath();
    const s = r * 0.9;
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(-s * 0.6, -s * 0.7, -s * 1.3, s * 0.2, 0, s * 1.2);
    ctx.bezierCurveTo(s * 1.3, s * 0.2, s * 0.6, -s * 0.7, 0, s * 0.4);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-s * 0.4, -s * 0.2, s * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  drawStarShape(ctx, r) {
    ctx.beginPath();
    const points = 5;
    const outer = r * 1.2;
    const inner = r * 0.55;
    for (let i = 0; i < points * 2; i++) {
      const rad = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.35, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  drawPawShape(ctx, r) {
    ctx.beginPath();
    ctx.ellipse(0, r * 0.25, r * 0.75, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const toeOffsets = [
      { x: -r * 0.6, y: -r * 0.35, rx: r * 0.25, ry: r * 0.3 },
      { x: -r * 0.22, y: -r * 0.65, rx: r * 0.26, ry: r * 0.34 },
      { x: r * 0.22, y: -r * 0.65, rx: r * 0.26, ry: r * 0.34 },
      { x: r * 0.6, y: -r * 0.35, rx: r * 0.25, ry: r * 0.3 }
    ];

    for (const t of toeOffsets) {
      ctx.beginPath();
      ctx.ellipse(t.x, t.y, t.rx, t.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(-r * 0.2, r * 0.1, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  drawAppleShape(ctx, r) {
    ctx.beginPath();
    ctx.arc(-r * 0.4, 0, r * 0.65, 0, Math.PI * 2);
    ctx.arc(r * 0.4, 0, r * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.4);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.8, r * 0.3, -r * 1.0);
    ctx.stroke();

    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.ellipse(r * 0.4, -r * 0.85, r * 0.25, r * 0.12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCupcakeShape(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(-r * 0.5, r * 0.9);
    ctx.lineTo(r * 0.5, r * 0.9);
    ctx.lineTo(r * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -r * 0.4, r * 0.6, 0, Math.PI * 2);
    ctx.arc(-r * 0.45, -r * 0.2, r * 0.45, 0, Math.PI * 2);
    ctx.arc(r * 0.45, -r * 0.2, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(0, -r * 0.9, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCrownShape(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, r * 0.6);
    ctx.lineTo(-r * 0.9, -r * 0.5);
    ctx.lineTo(-r * 0.35, -r * 0.1);
    ctx.lineTo(0, -r * 0.8);
    ctx.lineTo(r * 0.35, -r * 0.1);
    ctx.lineTo(r * 0.9, -r * 0.5);
    ctx.lineTo(r * 0.8, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(-r * 0.9, -r * 0.5, 3.5, 0, Math.PI * 2);
    ctx.arc(0, -r * 0.8, 4.5, 0, Math.PI * 2);
    ctx.arc(r * 0.9, -r * 0.5, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDiamondShape(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.0);
    ctx.lineTo(r * 0.9, 0);
    ctx.lineTo(0, r * 1.0);
    ctx.lineTo(-r * 0.9, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.9, 0);
    ctx.lineTo(r * 0.9, 0);
    ctx.moveTo(0, -r * 1.0);
    ctx.lineTo(0, r * 1.0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.3, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }
}

export class BubblePool {
  constructor(size = 70) {
    this.pool = Array.from({ length: size }, () => new Bubble());
  }

  spawn(x, y, vx, vy, colorHex, radius = 20, shape = 'circle', targetX = 0, targetY = 0) {
    const b = this.pool.find(item => !item.alive);
    if (b) {
      b.spawn(x, y, vx, vy, colorHex, radius, shape, targetX, targetY);
      return b;
    }
    return null;
  }

  update(dt, bounds, particlePool) {
    for (const b of this.pool) {
      if (b.alive) b.update(dt, bounds, particlePool);
    }
  }

  render(ctx) {
    for (const b of this.pool) {
      if (b.alive) b.render(ctx);
    }
  }

  getActive() {
    return this.pool.filter(b => b.alive);
  }

  clear() {
    for (const b of this.pool) {
      b.alive = false;
    }
  }
}
