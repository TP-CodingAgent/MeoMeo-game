/**
 * Cute Cat Bubble Shooter - Particle System
 * Manages water droplets, splatter marks, confetti, and floating hearts.
 */

export class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 4;
    this.color = '#ff99c8';
    this.alpha = 1;
    this.life = 1;
    this.maxLife = 1;
    this.type = 'droplet'; // 'droplet', 'heart', 'star', 'splat'
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.scale = 1;
    this.alive = false;
  }

  spawn(x, y, color, type = 'droplet', options = {}) {
    this.x = x;
    this.y = y;
    this.color = color || '#ff99c8';
    this.type = type;
    this.alive = true;
    this.alpha = 1;
    this.scale = options.scale || 1;

    const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
    const speed = options.speed !== undefined ? options.speed : (Math.random() * 120 + 30);

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = options.life || (Math.random() * 0.6 + 0.4);
    this.life = this.maxLife;
    this.radius = options.radius || (Math.random() * 4 + 2);
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 4;

    if (type === 'heart') {
      this.vy = -Math.abs(this.vy) * 0.8 - 40; // float upwards
      this.maxLife = 1.2;
      this.life = this.maxLife;
      this.radius = options.radius || 10;
    } else if (type === 'splat') {
      this.vx *= 0.1;
      this.vy *= 0.1;
      this.maxLife = options.life || 3.0; // splat stains fade slowly
      this.life = this.maxLife;
      this.radius = options.radius || (Math.random() * 12 + 8);
    }
  }

  update(dt) {
    if (!this.alive) return;

    this.life -= dt;
    if (this.life <= 0) {
      this.alive = false;
      return;
    }

    this.alpha = Math.max(0, this.life / this.maxLife);

    if (this.type === 'droplet') {
      this.vy += 280 * dt; // gravity
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.type === 'heart') {
      this.y += this.vy * dt;
      this.x += Math.sin(this.life * 6) * 20 * dt; // gentle sway
      this.scale = 1 + Math.sin((1 - this.life / this.maxLife) * Math.PI) * 0.3;
    } else if (this.type === 'star') {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.rotation += this.rotationSpeed * dt;
    } else if (this.type === 'splat') {
      // static splat mark fading
      this.scale = Math.min(1.2, 1 + (1 - this.alpha) * 0.2);
    }
  }

  render(ctx) {
    if (!this.alive || this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.translate(this.x, this.y);

    if (this.type === 'droplet') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'heart') {
      ctx.scale(this.scale, this.scale);
      ctx.fillStyle = this.color || '#ff4d6d';
      this.drawHeart(ctx, this.radius);
    } else if (this.type === 'star') {
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.fillStyle = this.color || '#ffd166';
      this.drawStar(ctx, 5, this.radius, this.radius * 0.5);
    } else if (this.type === 'splat') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      // small peripheral dots
      for (let i = 0; i < 4; i++) {
        const dotAngle = (i * Math.PI) / 2;
        const d = this.radius * 0.8;
        ctx.beginPath();
        ctx.arc(Math.cos(dotAngle) * d, Math.sin(dotAngle) * d, this.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawHeart(ctx, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      -size / 2, -size / 2,
      -size, topCurveHeight / 2,
      0, size
    );
    // top right curve
    ctx.bezierCurveTo(
      size, topCurveHeight / 2,
      size / 2, -size / 2,
      0, topCurveHeight
    );
    ctx.fill();
  }

  drawStar(ctx, points, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * ParticlePool manages reusable particles for peak 60fps performance
 */
export class ParticlePool {
  constructor(size = 200) {
    this.pool = Array.from({ length: size }, () => new Particle());
  }

  spawn(x, y, color, type = 'droplet', options = {}) {
    const p = this.pool.find(item => !item.alive);
    if (p) {
      p.spawn(x, y, color, type, options);
      return p;
    }
    return null;
  }

  burst(x, y, color, count = 12, type = 'droplet') {
    for (let i = 0; i < count; i++) {
      this.spawn(x, y, color, type);
    }
  }

  spawnHeart(x, y) {
    this.spawn(x, y, '#ff4d6d', 'heart', { radius: 10, speed: 60 });
  }

  update(dt) {
    for (const p of this.pool) {
      if (p.alive) p.update(dt);
    }
  }

  render(ctx) {
    for (const p of this.pool) {
      if (p.alive) p.render(ctx);
    }
  }

  clear() {
    for (const p of this.pool) {
      p.alive = false;
    }
  }
}
