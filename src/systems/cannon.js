/**
 * First-Person Water Blaster & Bubble Launching System
 * Renders an immersive, cute First-Person water gun at the bottom of the screen.
 * Follows mouse horizontal positioning so the player can aim directly underneath any target,
 * with perspective scaling, rainbow cycling, and multi-shape bubbles.
 */

import { clamp, lerp } from '../utils/math-physics.js';

export const RAINBOW_COLORS = [
  '#ff4757', // Đỏ dâu tây
  '#ffa502', // Cam rực rỡ
  '#ffd32a', // Vàng ánh dương
  '#2ed573', // Xanh lá tươi
  '#1e90ff', // Xanh biển sâu
  '#3742fa', // Xanh chàm quý phái
  '#9b59b6'  // Tím mộng mơ
];

export const STANDARD_COLORS = [
  '#ff6b8b', // Hồng kẹo ngọt
  '#48dbfb', // Xanh thiên thanh
  '#1dd1a1', // Xanh ngọc lục bảo
  '#feca57', // Vàng hoàng yến
  '#a29bfe'  // Tím oải hương
];

export class FirstPersonBlaster {
  constructor(canvasWidth = 1280, canvasHeight = 720) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Gun can move freely along bottom horizontal axis
    this.baseX = canvasWidth / 2;
    this.baseY = canvasHeight;
    this.currentGunX = this.baseX;

    // Aim coordinates
    this.aimX = canvasWidth / 2;
    this.aimY = canvasHeight / 2;
    this.aimAngle = -Math.PI / 2;

    // Water Tank Capacity & Cooldown (PDR-003)
    this.maxWater = 20;
    this.currentWater = 20;
    this.isCooldown = false;
    this.cooldownTimer = 0;
    this.cooldownDuration = 2.0;

    // Colors & Rainbow mode
    this.isRainbowMode = false;
    this.rainbowIndex = 0;
    this.selectedColor = STANDARD_COLORS[0];

    // Bubble Shape
    this.currentShape = 'circle';

    // Firing dynamics
    this.shotInterval = 0.08;
    this.lastShotTimer = 0;
    this.recoilOffset = 0;
    this.bubbleSpeed = 860;
  }

  get currentAmmo() { return this.currentWater; }
  set currentAmmo(val) { this.currentWater = val; }

  get maxAmmo() { return this.maxWater; }
  set maxAmmo(val) { this.maxWater = clamp(val, 1, 80); }

  setMaxWater(val) {
    this.maxWater = clamp(val, 1, 80);
    this.currentWater = Math.min(this.currentWater, this.maxWater);
  }

  setCooldownDuration(val) {
    const num = typeof val === 'number' ? val : parseFloat(val);
    this.cooldownDuration = clamp(isNaN(num) ? 2.0 : num, 0, 10);
    if (this.cooldownDuration <= 0 && this.isCooldown) {
      this.isCooldown = false;
      this.currentWater = this.maxWater;
      this.cooldownTimer = 0;
    }
  }

  get isCoolingDown() { return this.isCooldown; }
  set isCoolingDown(val) { this.isCooldown = val; }

  setAim(pointerX, pointerY) {
    this.aimX = clamp(pointerX, 30, this.canvasWidth - 30);
    this.aimY = clamp(pointerY, 30, this.canvasHeight - 60);

    const dx = this.aimX - this.currentGunX;
    const dy = this.aimY - (this.baseY - 30);
    this.aimAngle = Math.atan2(dy, dx);
  }

  setTarget(x, y) {
    this.setAim(x, y);
  }

  setBubbleColor(color) {
    if (color === 'rainbow') {
      this.isRainbowMode = true;
    } else {
      this.isRainbowMode = false;
      this.selectedColor = color;
    }
  }

  setBubbleShape(shapeId) {
    this.currentShape = shapeId || 'circle';
  }

  getActiveColor() {
    if (this.isRainbowMode) {
      return RAINBOW_COLORS[this.rainbowIndex % RAINBOW_COLORS.length];
    }
    return this.selectedColor;
  }

  reset() {
    this.currentWater = this.maxWater;
    this.isCooldown = false;
    this.cooldownTimer = 0;
    this.lastShotTimer = 0;
    this.recoilOffset = 0;
  }

  update(dt) {
    // Gun moves dynamically across the bottom bar to follow mouse X position
    // Clamped so it doesn't clip off the screen
    const targetGunX = clamp(this.aimX, 180, this.canvasWidth - 180);
    this.currentGunX = lerp(this.currentGunX, targetGunX, dt * 14);

    // Recalculate aim angle smoothly with current gliding gun position (Eliminates rotational lag)
    const dx = this.aimX - this.currentGunX;
    const dy = this.aimY - (this.baseY - 30);
    this.aimAngle = Math.atan2(dy, dx);

    // Recoil recovery
    this.recoilOffset = Math.max(0, this.recoilOffset - dt * 60);

    if (this.lastShotTimer > 0) {
      this.lastShotTimer -= dt;
    }

    if (this.isCooldown) {
      if (this.cooldownDuration <= 0) {
        this.isCooldown = false;
        this.currentWater = this.maxWater;
        this.cooldownTimer = 0;
      } else {
        this.cooldownTimer += dt;
        if (this.cooldownTimer >= this.cooldownDuration) {
          this.isCooldown = false;
          this.currentWater = this.maxWater;
          this.cooldownTimer = 0;
        }
      }
    }
  }

  shoot(force = false) {
    return this.fire(force);
  }

  fire(force = false) {
    if (this.isCooldown || this.currentWater <= 0) {
      return null;
    }
    if (!force && this.lastShotTimer > 0) {
      return null;
    }

    this.currentWater--;
    this.lastShotTimer = this.shotInterval;
    this.recoilOffset = 18;

    const color = this.getActiveColor();
    if (this.isRainbowMode) {
      this.rainbowIndex++;
    }

    // Nozzle exit coordinates
    const barrelLength = 110;
    const nozzleX = this.currentGunX + Math.cos(this.aimAngle) * barrelLength;
    const nozzleY = (this.baseY + 10) + Math.sin(this.aimAngle) * barrelLength;

    const dx = this.aimX - nozzleX;
    const dy = this.aimY - nozzleY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const speed = this.bubbleSpeed;

    if (this.currentWater <= 0) {
      if (this.cooldownDuration <= 0) {
        this.currentWater = this.maxWater;
        this.isCooldown = false;
        this.cooldownTimer = 0;
      } else {
        this.isCooldown = true;
        this.cooldownTimer = 0;
      }
    }

    return {
      x: nozzleX,
      y: nozzleY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      targetX: this.aimX,
      targetY: this.aimY,
      color,
      radius: 20,
      shape: this.currentShape
    };
  }

  getWaterPercentage() {
    if (this.isCooldown) {
      return this.cooldownTimer / this.cooldownDuration;
    }
    return this.currentWater / this.maxWater;
  }

  render(ctx) {
    this.renderBlaster(ctx);
    this.renderCrosshair(ctx);
  }

  renderBlaster(ctx) {
    ctx.save();

    const gunX = this.currentGunX;
    const gunY = this.baseY + 15 + this.recoilOffset;

    ctx.translate(gunX, gunY);
    ctx.rotate(this.aimAngle + Math.PI / 2);

    const activeColor = this.getActiveColor();

    // 1. Water Gun Barrel Body
    ctx.fillStyle = '#ff758c';
    ctx.beginPath();
    ctx.roundRect(-22, -120, 44, 110, [18, 18, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 2. High-Tech Water Tank Chamber on Gun
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(-16, -95, 32, 60, 10);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sloshing Water Level inside blaster
    const waterRatio = this.currentWater / this.maxWater;
    const waterHeight = 54 * waterRatio;
    ctx.fillStyle = this.isCooldown ? '#b0bec5' : activeColor;
    ctx.beginPath();
    ctx.roundRect(-14, -38 - waterHeight, 28, waterHeight, 6);
    ctx.fill();

    // 3. Golden Pressure Gauge
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(0, -22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Needle
    ctx.strokeStyle = '#d63031';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    const needleAngle = -Math.PI * 0.75 + Math.PI * 1.5 * waterRatio;
    ctx.lineTo(Math.cos(needleAngle) * 9, -22 + Math.sin(needleAngle) * 9);
    ctx.stroke();

    // 4. Nozzle Tip
    ctx.fillStyle = this.isCooldown ? '#95a5a6' : activeColor;
    ctx.beginPath();
    ctx.ellipse(0, -124, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ready bubble peeking out of nozzle
    if (!this.isCooldown && this.currentWater > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(0, -128, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  renderCrosshair(ctx) {
    ctx.save();
    ctx.translate(this.aimX, this.aimY);

    const activeColor = this.getActiveColor();

    // Outer aiming ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Colored crosshair ticks
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(0, -18);
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 24);
    ctx.moveTo(-24, 0);
    ctx.lineTo(-18, 0);
    ctx.moveTo(18, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();

    // Center glow dot
    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

export const Cannon = FirstPersonBlaster;
export const BubbleCannon = FirstPersonBlaster;
