/**
 * Cat Spawner & Rarity Selection Engine
 * TP AIDLC - Cute Cat Color Water Shooter (PDR-006, US-09)
 * Balances cat populations across ground floors and elevated tiers,
 * supporting dynamic leap transitions.
 */

import { CAT_CATALOG } from '../data/cat-catalog.js';
import { randomChoice, randomRange, clamp } from '../utils/math-physics.js';
import { Cat } from '../entities/cat.js';

export const CAT_STATES = {
  IDLE: 'IDLE',
  WALKING: 'WALKING',
  HIDING: 'HIDING',
  PEEKING: 'PEEKING',
  SURPRISED: 'SURPRISED',
  RUNNING: 'RUNNING',
  CELEBRATING: 'CELEBRATING',
  LEAPING: 'LEAPING'
};

export class CatSpawner {
  constructor() {
    this.tier1_2 = CAT_CATALOG.filter(b => b.rarity <= 2);
    this.tier3 = CAT_CATALOG.filter(b => b.rarity === 3);
    this.tier4 = CAT_CATALOG.filter(b => b.rarity === 4);
    this.tier5 = CAT_CATALOG.filter(b => b.rarity === 5);

    this.activeCats = [];
    this.minActiveCats = 4;
    this.maxActiveCats = 6;
    this.spawnTimer = 0;
    this.spawnInterval = 2.8;
  }

  setMinCats(minVal) {
    this.minActiveCats = clamp(minVal, 2, 10);
    this.maxActiveCats = Math.max(this.minActiveCats + 2, 6);
  }

  reset() {
    this.activeCats = [];
    this.spawnTimer = 0;
  }

  rollBreed(forcedRoll = null) {
    const roll = forcedRoll !== null ? forcedRoll : Math.random();
    if (roll < 0.70) {
      return randomChoice(this.tier1_2);
    } else if (roll < 0.90) {
      return randomChoice(this.tier3);
    } else if (roll < 0.97) {
      return randomChoice(this.tier4);
    } else {
      return randomChoice(this.tier5);
    }
  }

  spawnCat(props = [], platforms = []) {
    if (this.activeCats.length >= this.maxActiveCats) {
      return null;
    }

    const breed = this.rollBreed();
    let startX = 300;
    let startY = 530;
    let chosenPlat = null;

    // Check count of ground vs platform cats
    const groundCatsCount = this.activeCats.filter(c => !c.platform).length;

    // If less than 2 cats on the ground, guarantee ground spawn
    if (groundCatsCount >= 2 && platforms && platforms.length > 0 && Math.random() < 0.5) {
      chosenPlat = randomChoice(platforms);
      startX = randomRange(chosenPlat.x - chosenPlat.width / 2 + 35, chosenPlat.x + chosenPlat.width / 2 - 35);
      startY = chosenPlat.y - 10;
    } else {
      // Spawn on ground floor
      const spawnFromLeft = Math.random() < 0.5;
      startX = spawnFromLeft ? randomRange(90, 360) : randomRange(740, 1180);
      startY = 530;
    }

    const cat = new Cat(breed, startX, startY, chosenPlat);

    // If spawned on ground, chance to start concealed behind an available ground prop
    if (!chosenPlat && props && props.length > 0 && Math.random() < 0.4) {
      const groundProps = props.filter(p => !p.isPlatform && !p.hidingCat);
      if (groundProps.length > 0) {
        const chosenProp = randomChoice(groundProps);
        cat.hideBehind(chosenProp);
      }
    }

    this.activeCats.push(cat);
    return cat;
  }

  update(dt, bounds = { width: 1280, height: 720 }, props = [], platforms = []) {
    // Ensure minimum active cats are always present
    while (this.activeCats.length < this.minActiveCats) {
      const spawned = this.spawnCat(props, platforms);
      if (!spawned) break;
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      if (this.activeCats.length < this.maxActiveCats) {
        this.spawnCat(props, platforms);
      }
    }

    for (const cat of this.activeCats) {
      cat.update(dt, bounds, props, platforms);
    }
  }
}

export const catSpawner = new CatSpawner();
