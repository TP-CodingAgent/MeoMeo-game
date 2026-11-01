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
  LEAPING: 'LEAPING',
  LEAVING: 'LEAVING',
  ENTERING: 'ENTERING'
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
    this.spawnInterval = 2.4;

    // Bad Luck Protection & Discovery Pity Counters
    this.sessionPlayTime = 0;      // Total seconds played in session
    this.spawnsSinceRare = 0;      // Spawns since last Tier 4 or Tier 5 cat
    this.spawnsSinceMissing = 0;   // Spawns since last uncollected breed
  }

  setMinCats(minVal) {
    this.minActiveCats = clamp(minVal, 2, 10);
    this.maxActiveCats = Math.max(this.minActiveCats + 2, 6);
  }

  reset() {
    this.activeCats = [];
    this.spawnTimer = 0;
    // Note: sessionPlayTime is preserved so stage transitions do not wipe player's discovery progress!
  }

  rollBreed(forcedRoll = null, unlockedCatIds = null) {
    // 1. Identify missing breeds in player's album
    const missingCats = (unlockedCatIds && unlockedCatIds.size < CAT_CATALOG.length)
      ? CAT_CATALOG.filter(b => !unlockedCatIds.has(b.id))
      : [];

    this.spawnsSinceRare++;
    this.spawnsSinceMissing++;

    // 2. DISCOVERY PITY RULE: Ensure players discover all 12 cats after active play
    if (missingCats.length > 0) {
      // After 10 minutes (600s): 100% Guarantees missing breeds spawn immediately until album complete!
      if (this.sessionPlayTime >= 600) {
        this.spawnsSinceMissing = 0;
        this.spawnsSinceRare = 0;
        return randomChoice(missingCats);
      }
      // After 5 minutes (300s): Significantly boosts missing breeds appearance (80% chance or every 2 spawns)
      else if (this.sessionPlayTime >= 300) {
        if (this.spawnsSinceMissing >= 2 || Math.random() < 0.80) {
          this.spawnsSinceMissing = 0;
          this.spawnsSinceRare = 0;
          return randomChoice(missingCats);
        }
      }
    }

    // 3. BAD LUCK PROTECTION: Every 5 spawns without a 4-star or 5-star cat guarantees a rare cat!
    if (this.spawnsSinceRare >= 5) {
      this.spawnsSinceRare = 0;
      const missingTier5 = missingCats.filter(b => b.rarity === 5);
      if (missingTier5.length > 0) {
        this.spawnsSinceMissing = 0;
        return randomChoice(missingTier5);
      }
      const missingTier4 = missingCats.filter(b => b.rarity === 4);
      if (missingTier4.length > 0) {
        this.spawnsSinceMissing = 0;
        return randomChoice(missingTier4);
      }
      return Math.random() < 0.5 ? randomChoice(this.tier5) : randomChoice(this.tier4);
    }

    // 4. IMPROVED BASE RARITY RATES (Much more generous than original 3% tier 5)
    // Tier 1-2: 40% (was 70%)
    // Tier 3:   25% (was 20%)
    // Tier 4:   20% (was 7%)
    // Tier 5:   15% (was 3% - 5x boost!)
    const roll = forcedRoll !== null ? forcedRoll : Math.random();
    if (roll < 0.40) {
      return randomChoice(this.tier1_2);
    } else if (roll < 0.65) {
      return randomChoice(this.tier3);
    } else if (roll < 0.85) {
      this.spawnsSinceRare = 0;
      return randomChoice(this.tier4);
    } else {
      // Tier 5 roll: Prioritize missing 5-star cats if any
      this.spawnsSinceRare = 0;
      const missingTier5 = missingCats.filter(b => b.rarity === 5);
      if (missingTier5.length > 0) {
        this.spawnsSinceMissing = 0;
        return randomChoice(missingTier5);
      }
      return randomChoice(this.tier5);
    }
  }

  spawnCat(props = [], platforms = [], unlockedCatIds = null, enterFromEdge = false, bounds = { width: 1280, height: 720 }) {
    if (this.activeCats.length >= this.maxActiveCats) {
      return null;
    }

    const breed = this.rollBreed(null, unlockedCatIds);
    let startX = 300;
    let startY = 530;
    let chosenPlat = null;
    let isEntering = false;
    let enteringTargetX = 300;
    let enteringDir = 1;

    if (enterFromEdge) {
      // Natural Entrance: Walk casually into the room from off-screen edges
      const spawnFromLeft = Math.random() < 0.5;
      startX = spawnFromLeft ? -45 : bounds.width + 45;
      startY = 530;
      chosenPlat = null;
      isEntering = true;
      enteringDir = spawnFromLeft ? 1 : -1;
      enteringTargetX = spawnFromLeft
        ? randomRange(160, 420)
        : randomRange(bounds.width - 420, bounds.width - 160);
    } else {
      // Initial Stage Load: Distribute between floor and elevated tiers
      const groundCatsCount = this.activeCats.filter(c => !c.platform).length;
      if (groundCatsCount >= 2 && platforms && platforms.length > 0 && Math.random() < 0.5) {
        chosenPlat = randomChoice(platforms);
        startX = randomRange(chosenPlat.x - chosenPlat.width / 2 + 35, chosenPlat.x + chosenPlat.width / 2 - 35);
        startY = chosenPlat.y - 10;
      } else {
        const spawnFromLeft = Math.random() < 0.5;
        startX = spawnFromLeft ? randomRange(120, 420) : randomRange(740, 1140);
        startY = 530;
      }
    }

    const cat = new Cat(breed, startX, startY, chosenPlat);

    if (isEntering) {
      cat.state = CAT_STATES.ENTERING;
      cat.direction = enteringDir;
      cat.targetX = enteringTargetX;
      cat.stateTimer = 9.0;
    } else if (!chosenPlat && props && props.length > 0 && Math.random() < 0.35) {
      // Ground initial spawn: chance to hide behind furniture
      const groundProps = props.filter(p => !p.isPlatform && !p.hidingCat);
      if (groundProps.length > 0) {
        const chosenProp = randomChoice(groundProps);
        cat.hideBehind(chosenProp);
      }
    }

    this.activeCats.push(cat);
    return cat;
  }

  update(dt, bounds = { width: 1280, height: 720 }, props = [], platforms = [], unlockedCatIds = null) {
    this.sessionPlayTime += dt;

    // 1. Natural Cat Turnover: Clean up cats that fully exited stage
    const hadCats = this.activeCats.length > 0;
    this.activeCats = this.activeCats.filter(c => !c.isDespawned);

    // 2. Count active cats currently on-stage (excluding cats actively leaving)
    const onStageCats = this.activeCats.filter(c => c.state !== CAT_STATES.LEAVING);

    // 3. Ensure minimum active cats are ALWAYS visible and active on stage!
    // If starting completely fresh (empty room), place cats directly on stage (enterFromEdge = false).
    // If room is already active, incoming cats enter naturally from screen edge (enterFromEdge = true)!
    while (onStageCats.length < this.minActiveCats && this.activeCats.length < this.maxActiveCats) {
      const enterFromEdge = hadCats;
      const spawned = this.spawnCat(props, platforms, unlockedCatIds, enterFromEdge, bounds);
      if (!spawned) break;
      onStageCats.push(spawned);
    }

    // 4. Periodic spawning up to maxActiveCats
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      if (this.activeCats.length < this.maxActiveCats && onStageCats.length < this.maxActiveCats) {
        this.spawnCat(props, platforms, unlockedCatIds, true, bounds);
      }
    }

    // 5. Update individual cat entity logic with awareness of stage population
    for (const cat of this.activeCats) {
      cat.update(dt, bounds, props, platforms, this.activeCats);
    }
  }
}

export const catSpawner = new CatSpawner();
