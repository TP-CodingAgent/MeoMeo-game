/**
 * T- P: Math and Physics Utility Module
 * TP AIDLC - Cute Cat Color Water Shooter
 */

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// T- P: Random Choice
export function randomChoice(array) {
  if (!array || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// T -P: Is Point In AABB
export function isPointInAABB(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * TP: Circle to Circle Collision Check
 * Accepts both (c1, c2) or (x1, y1, r1, x2, y2, r2)
 */
export function checkCircleCollision(c1, c2) {
  if (!c1 || !c2) return false;
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distSq = dx * dx + dy * dy;
  const radSum = c1.radius + c2.radius;
  return distSq <= radSum * radSum;
}

export function isCircleCollidingCircle(x1, y1, r1, x2, y2, r2) {
  if (typeof x1 === 'object') {
    return checkCircleCollision(x1, y1);
  }
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distSq = dx * dx + dy * dy;
  const radSum = r1 + r2;
  return distSq <= radSum * radSum;
}

/**
 * Circle to Axis-Aligned Bounding Box (AABB) Collision Check
 * Accepts both (circle, rect) or (cx, cy, cr, rx, ry, rw, rh)
 */
export function checkCircleRectCollision(circle, rect) {
  if (!circle || !rect) return false;
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export function isCircleCollidingAABB(cx, cy, cr, rx, ry, rw, rh) {
  if (typeof cx === 'object') {
    return checkCircleRectCollision(cx, cy);
  }
  const closestX = clamp(cx, rx, rx + rw);
  const closestY = clamp(cy, ry, ry + rh);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= cr * cr;
}

/**
 * Damped Harmonic Spring Simulation
 */
export function calculateSpring(offset, velocity, k = 180, damping = 12, dt = 0.016) {
  const force = -k * offset - damping * velocity;
  const newVelocity = velocity + force * dt;
  const newOffset = offset + newVelocity * dt;
  return {
    offset: Math.abs(newOffset) < 0.01 && Math.abs(newVelocity) < 0.05 ? 0 : newOffset,
    velocity: Math.abs(newOffset) < 0.01 && Math.abs(newVelocity) < 0.05 ? 0 : newVelocity
  };
}

export function springUpdate(pos, vel, target = 0, k = 180, damping = 12, dt = 0.016) {
  const offset = pos - target;
  const force = -k * offset - damping * vel;
  const newVel = vel + force * dt;
  const newPos = pos + newVel * dt;
  return {
    pos: Math.abs(newPos - target) < 0.005 && Math.abs(newVel) < 0.01 ? target : newPos,
    vel: Math.abs(newPos - target) < 0.005 && Math.abs(newVel) < 0.01 ? 0 : newVel
  };
}

/**
 * Convert Hex Color (#RRGGBB) to rgba string
 */
export function hexToRgba(hex, alpha = 1.0) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
