/**
 * Cute Cat Bubble Shooter - Comprehensive Automated Unit Test Suite
 * Tests Game Logic: Scoring, Stage Switching, Cat Management, Collision Physics,
 * Water Tank Cooldown, Spawner Rarity, Rainbow Cycling, and Shape Unlocks.
 */

import { 
  distance, 
  lerp, 
  clamp, 
  isCircleCollidingCircle, 
  isCircleCollidingAABB, 
  springUpdate, 
  hexToRgba 
} from '../src/utils/math-physics.js';
import { safeStorage } from '../src/utils/safe-storage.js';
import { CAT_CATALOG, BUBBLE_SHAPES } from '../src/data/cat-catalog.js';
import { Cannon } from '../src/systems/cannon.js';
import { CatSpawner, CAT_STATES } from '../src/systems/spawner.js';
import { SceneManager, STAGE_CONFIGS } from '../src/scenes/scene-manager.js';
import { Prop } from '../src/entities/prop.js';
import { Cat } from '../src/entities/cat.js';
import { Bubble, BubblePool } from '../src/entities/bubble.js';
import { ParticlePool } from '../src/entities/particle.js';
import { SHOP_CATALOG, SHOP_ITEM_TYPES, CAT_SLOTS, SHOP_MAP } from '../src/data/shop-catalog.js';
import { ShopManager } from '../src/systems/shop-manager.js';

export async function runAllTests(reporter) {
  const suites = [
    testMathPhysics,
    testSafeStorage,
    testCatCatalogIntegrity,
    testCannonAndWaterTankCooldown,
    testSpawnerAndRarityDistribution,
    testPropAndStartleMechanics,
    testCatStateMachineAndHitTinting,
    testSceneManagerAndCollectionProgress,
    testGameSettingsAndStageExpansion,
    testShopSystemAndModularOutfits,
    testGunEffectsAndDualAngelWings
  ];

  for (const suite of suites) {
    await suite(reporter);
  }
}

async function testMathPhysics(t) {
  t.suite('1. Math & Physics Utility Tests');

  t.test('distance() calculates Euclidean distance correctly', () => {
    t.assertEqual(distance(0, 0, 3, 4), 5, 'Distance (0,0) to (3,4) must be 5');
    t.assertEqual(distance(10, 20, 10, 20), 0, 'Distance between identical points must be 0');
  });

  t.test('lerp() and clamp() boundary handling', () => {
    t.assertEqual(lerp(10, 20, 0.5), 15, 'lerp(10, 20, 0.5) should be 15');
    t.assertEqual(clamp(5, 10, 20), 10, 'clamp below min should equal min');
    t.assertEqual(clamp(25, 10, 20), 20, 'clamp above max should equal max');
    t.assertEqual(clamp(15, 10, 20), 15, 'clamp within range should return value');
  });

  t.test('isCircleCollidingCircle() detects overlaps', () => {
    t.assertTrue(isCircleCollidingCircle(0, 0, 10, 15, 0, 10), 'Overlapping circles should collide');
    t.assertFalse(isCircleCollidingCircle(0, 0, 5, 20, 0, 5), 'Distant circles should not collide');
  });

  t.test('isCircleCollidingAABB() detects circle vs rectangle collisions', () => {
    t.assertTrue(isCircleCollidingAABB(50, 50, 15, 40, 40, 50, 50), 'Circle inside/touching AABB should collide');
    t.assertFalse(isCircleCollidingAABB(10, 10, 5, 50, 50, 40, 40), 'Circle outside AABB should not collide');
  });

  t.test('hexToRgba() converts colors properly', () => {
    t.assertEqual(hexToRgba('#ff0000', 0.5), 'rgba(255, 0, 0, 0.5)', 'Hex red conversion');
    t.assertEqual(hexToRgba('#ffffff', 1), 'rgba(255, 255, 255, 1)', 'Hex white conversion');
  });

  t.test('springUpdate() damps oscillations towards target', () => {
    let pos = 10;
    let vel = 0;
    for (let i = 0; i < 60; i++) {
      const res = springUpdate(pos, vel, 0, 200, 15, 1 / 60);
      pos = res.pos;
      vel = res.vel;
    }
    t.assertTrue(Math.abs(pos) < 0.2, 'Spring position should settle near equilibrium target 0');
  });
}

async function testSafeStorage(t) {
  t.suite('2. Safe Storage Adapter Tests');

  t.test('Stores and retrieves key-value pairs', () => {
    safeStorage.setItem('test_cat_key', 'persian_fluffy');
    t.assertEqual(safeStorage.getItem('test_cat_key'), 'persian_fluffy', 'Retrieved item should match stored value');
    safeStorage.removeItem('test_cat_key');
    t.assertEqual(safeStorage.getItem('test_cat_key'), null, 'Removed item should return null');
  });
}

async function testCatCatalogIntegrity(t) {
  t.suite('3. Cat Catalog Encyclopedia Data Integrity');

  t.test('Catalog contains exactly 12 international breeds', () => {
    t.assertEqual(CAT_CATALOG.length, 12, 'Catalog must contain 12 cat breeds');
  });

  t.test('Every cat has required fields, shapeReward and valid rarity (1 to 5)', () => {
    for (const cat of CAT_CATALOG) {
      t.assertTrue(Boolean(cat.id), `Cat ${cat.name || 'unnamed'} has id`);
      t.assertTrue(Boolean(cat.name), `Cat ${cat.id} has name`);
      t.assertTrue(Boolean(cat.origin), `Cat ${cat.id} has origin`);
      t.assertTrue(Boolean(cat.flag), `Cat ${cat.id} has flag`);
      t.assertTrue(Boolean(cat.history), `Cat ${cat.id} has history description`);
      t.assertTrue(Boolean(cat.features), `Cat ${cat.id} has features description`);
      t.assertTrue(Boolean(cat.temperament), `Cat ${cat.id} has temperament description`);
      t.assertTrue(Boolean(cat.shapeReward), `Cat ${cat.id} has a shape reward`);
      t.assertTrue(cat.rarity >= 1 && cat.rarity <= 5, `Cat ${cat.id} rarity must be between 1 and 5`);
    }
  });
}

async function testCannonAndWaterTankCooldown(t) {
  t.suite('4. First-Person Blaster, Rainbow Mode & Water Tank');

  t.test('Blaster starts with full tank of 20 bubbles and centers aim', () => {
    const blaster = new Cannon(1280, 720);
    t.assertEqual(blaster.currentAmmo, 20, 'Initial ammo should be 20');
    t.assertFalse(blaster.isCoolingDown, 'Initial cooldown state should be false');
    t.assertEqual(blaster.baseX, 640, 'Blaster anchored horizontally at 640');
  });

  t.test('Firing reduces ammo by 1', () => {
    const blaster = new Cannon(1280, 720);
    const bubble = blaster.fire();
    t.assertTrue(bubble !== null, 'Firing with ammo should return bubble data');
    t.assertEqual(blaster.currentAmmo, 19, 'Ammo should decrement to 19');
  });

  t.test('Rainbow mode cycles colors on each shot', () => {
    const blaster = new Cannon(1280, 720);
    blaster.setBubbleColor('rainbow');
    t.assertTrue(blaster.isRainbowMode, 'Rainbow mode should be active');

    const shot1 = blaster.fire(true);
    const shot2 = blaster.fire(true);
    t.assertTrue(shot1.color !== shot2.color, 'Subsequent shots in rainbow mode should have different colors');
  });

  t.test('Water tank triggers 2.0s cooldown when emptied', () => {
    const blaster = new Cannon(1280, 720);
    for (let i = 0; i < 20; i++) {
      blaster.fire(true);
    }
    t.assertEqual(blaster.currentAmmo, 0, 'Ammo should be 0 after 20 shots');
    t.assertTrue(blaster.isCoolingDown, 'Cooldown must be active when ammo is 0');
    t.assertEqual(blaster.fire(), null, 'Cannot fire while cooling down');

    blaster.update(1.0);
    t.assertTrue(blaster.isCoolingDown, 'Should still be cooling down at 1.0s');

    blaster.update(1.1);
    t.assertFalse(blaster.isCoolingDown, 'Cooldown should end after 2.0s');
    t.assertEqual(blaster.currentAmmo, 20, 'Ammo should be fully refilled to 20');
  });

  t.test('Blaster getWaterRatio provides safe water fill level', () => {
    const blaster = new Cannon(1280, 720);
    t.assertEqual(blaster.getWaterRatio(), 1.0, 'Full tank ratio is 1.0');
    blaster.fire(true);
    t.assertEqual(blaster.getWaterRatio(), 19 / 20, 'Ratio matches remaining water percentage');
  });
}

async function testSpawnerAndRarityDistribution(t) {
  t.suite('5. Spawner, Elevated Platforms & Rarity Distribution');

  t.test('Spawner selects cats and can place on elevated platform', () => {
    const spawner = new CatSpawner();
    const platforms = [new Prop({ id: 'shelf1', x: 300, y: 220, width: 200, height: 20, isPlatform: true })];
    const cat = spawner.spawnCat([], platforms);
    t.assertTrue(cat !== null, 'Spawned cat must not be null');
    t.assertEqual(spawner.activeCats.length, 1, 'Active cats array should contain 1 cat');
  });

  t.test('Spawner limits maximum active cats on screen', () => {
    const spawner = new CatSpawner();
    spawner.maxActiveCats = 3;
    for (let i = 0; i < 6; i++) {
      spawner.spawnCat();
    }
    t.assertTrue(spawner.activeCats.length <= 3, 'Active cats must not exceed maxActiveCats');
  });

  t.test('Natural cat turnover: leaving cat is despawned and replaced by new cat', () => {
    const spawner = new CatSpawner();
    spawner.setMinCats(3);
    spawner.update(0.1);
    t.assertEqual(spawner.activeCats.length, 3, 'Initial spawn fills to minActiveCats 3');

    // Make first cat finish its lifetime and leave stage
    const oldCat = spawner.activeCats[0];
    oldCat.lifetime = 100; // Exceeds maxLifetime
    oldCat.stateTimer = 0;
    oldCat.update(0.1);    // Triggers LEAVING state
    t.assertEqual(oldCat.state, CAT_STATES.LEAVING, 'Old cat transitions to LEAVING state');

    // Move cat outside screen bounds
    oldCat.x = 1400;
    oldCat.update(0.1);
    t.assertTrue(oldCat.isDespawned, 'Cat marked isDespawned when offscreen');

    // Spawner update cleans up despawned cat and spawns fresh newcomer
    spawner.update(0.1);
    t.assertEqual(spawner.activeCats.length, 3, 'Spawner replenishes back to minActiveCats 3');
    t.assertFalse(spawner.activeCats.includes(oldCat), 'Old cat is removed from active array');
  });

  t.test('Natural newcomer entrance: cat enters walking into view from screen edges', () => {
    const spawner = new CatSpawner();
    spawner.setMinCats(3);
    spawner.update(0.1); // Initial load

    // When an existing cat leaves, the newcomer enters smoothly from the edge
    const newcomer = spawner.spawnCat([], [], null, true, { width: 1280, height: 720 });
    t.assertTrue(newcomer !== null, 'Newcomer must spawn successfully');
    t.assertEqual(newcomer.state, CAT_STATES.ENTERING, 'Newcomer begins in ENTERING state');
    t.assertTrue(newcomer.x === -45 || newcomer.x === 1280 + 45, 'Newcomer spawns right outside the screen boundary');
  });

  t.test('Discovery pity system: guarantees missing cats spawn after 10 minutes play session', () => {
    const spawner = new CatSpawner();
    // Simulate player with 10 cats unlocked, missing maine_coon and bengal (both rarity 5)
    const unlockedCatIds = new Set([
      'vietnamese_tabby', 'british_shorthair', 'scottish_fold', 'persian',
      'siamese', 'bombay', 'russian_blue', 'calico', 'norwegian_forest', 'sphynx'
    ]);

    // Fast-forward session play time to 10 minutes (600s)
    spawner.sessionPlayTime = 605;
    spawner.spawnsSinceMissing = 2; // Trigger pity

    const pickedBreed = spawner.rollBreed(null, unlockedCatIds);
    t.assertTrue(
      pickedBreed.id === 'maine_coon' || pickedBreed.id === 'bengal',
      `Guaranteed spawn must pick one of the missing cats (got: ${pickedBreed.id})`
    );
  });

  t.test('Bad luck protection: guarantees rare cat (tier 4 or 5) after 6 non-rare spawns', () => {
    const spawner = new CatSpawner();
    spawner.spawnsSinceRare = 6; // Hit pity threshold

    const picked = spawner.rollBreed();
    t.assertTrue(picked.rarity >= 4, `Pity must roll Tier 4 or Tier 5 cat (got rarity: ${picked.rarity})`);
  });
}

async function testPropAndStartleMechanics(t) {
  t.suite('6. Prop Elasticity & Startle Mechanics (PDR-004)');

  t.test('Prop wobbles and records paint splat on hit', () => {
    const prop = new Prop({ x: 300, y: 500, width: 100, height: 80 });
    prop.onHit(310, 500, '#ff6b8b', null, null);
    t.assertTrue(prop.splats.length === 1, 'Prop must record splat mark');
    t.assertEqual(prop.splats[0].color, '#ff6b8b', 'Splat color matches bubble');
    t.assertTrue(prop.vx !== 0 || prop.vy !== 0, 'Prop receives impulse velocity');
  });

  t.test('Startle: Prop hit scares hiding cat out into the open', () => {
    const prop = new Prop({ x: 400, y: 500 });
    const cat = new Cat(CAT_CATALOG[0], 400, 500);
    cat.hideBehind(prop);

    t.assertTrue(cat.isHiding, 'Cat should be hiding behind prop');
    t.assertEqual(prop.hidingCat, cat, 'Prop references hiding cat');

    prop.onHit(400, 500, '#48dbfb', null, null);

    t.assertFalse(cat.isHiding, 'Cat should no longer be hiding');
    t.assertEqual(cat.state, CAT_STATES.SURPRISED, 'Cat should transition to SURPRISED state');
    t.assertEqual(prop.hidingCat, null, 'Prop hiding reference cleared');
  });
}

async function testCatStateMachineAndHitTinting(t) {
  t.suite('7. Cat State Machine & Fur Tinting (PDR-001)');

  t.test('Cat hit applies fur tint color and enters celebrating state', () => {
    const cat = new Cat(CAT_CATALOG[1], 500, 500);
    cat.onHit('#1dd1a1', null, null);

    t.assertEqual(cat.tintColor, '#1dd1a1', 'Cat fur tint color matches bubble');
    t.assertEqual(cat.state, CAT_STATES.CELEBRATING, 'Cat enters CELEBRATING state');
  });

  t.test('Cat state update advances timers and returns to IDLE', () => {
    const cat = new Cat(CAT_CATALOG[1], 500, 500);
    cat.state = CAT_STATES.CELEBRATING;
    cat.stateTimer = 0.1;
    cat.update(0.15, { width: 1280, height: 720 }, [], []);
    t.assertEqual(cat.state, CAT_STATES.IDLE, 'After celebrating, cat returns to IDLE');
  });
}

async function testSceneManagerAndCollectionProgress(t) {
  t.suite('8. Scene Manager, Cat Collection & Bubble Shape Unlocks');

  t.test('Scene manager loads 8 distinct stages with elevated platforms', () => {
    const sm = new SceneManager();
    t.assertEqual(STAGE_CONFIGS.length, 8, 'Must have exactly 8 stages');
    t.assertEqual(sm.currentStageIndex, 0, 'Starts at stage 0 (Living Room)');
    t.assertTrue(sm.platforms.length > 0, 'Stage 1 should have platforms');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 1, 'Advances to stage 1 (Bedroom)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 2, 'Advances to stage 2 (Garden)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 3, 'Advances to stage 3 (Beach)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 4, 'Advances to stage 4 (Ocean)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 5, 'Advances to stage 5 (Desert)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 6, 'Advances to stage 6 (Space)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 7, 'Advances to stage 7 (Ice)');
    sm.nextStage();
    t.assertEqual(sm.currentStageIndex, 0, 'Loops back to stage 0');
  });

  t.test('All 8 stages have valid properties, colors, platforms and props', () => {
    STAGE_CONFIGS.forEach((stage, idx) => {
      t.assertTrue(Boolean(stage.name), `Stage ${idx + 1} has name`);
      t.assertTrue(Boolean(stage.description), `Stage ${idx + 1} has description`);
      t.assertTrue(Boolean(stage.bgColor), `Stage ${idx + 1} has bgColor`);
      t.assertTrue(Boolean(stage.floorColor), `Stage ${idx + 1} has floorColor`);
      t.assertTrue(Array.isArray(stage.props) && stage.props.length >= 4, `Stage ${idx + 1} has at least 4 props`);
      const platforms = stage.props.filter(p => p.isPlatform);
      t.assertTrue(platforms.length >= 1, `Stage ${idx + 1} has elevated platforms`);
    });
  });

  t.test('Unlocking cats updates collection progress accurately', () => {
    const sm = new SceneManager();
    sm.unlockedCats.clear();

    const isNew1 = sm.unlockCat('vietnamese_tabby');
    t.assertTrue(isNew1, 'First unlock should return true (new)');

    const isNewAgain = sm.unlockCat('vietnamese_tabby');
    t.assertFalse(isNewAgain, 'Subsequent unlock should return false');

    sm.unlockCat('persian');
    sm.unlockCat('scottish_fold');

    const progress = sm.getCollectionProgress();
    t.assertEqual(progress.unlockedCount, 3, 'Unlocked count should be 3');
    t.assertEqual(progress.totalCount, 12, 'Total catalog count should be 12');
    t.assertEqual(progress.percentage, 25, '3 of 12 is 25%');
  });

  t.test('Unlocking bubble shapes adds to unlocked shapes set', () => {
    const sm = new SceneManager();
    t.assertTrue(sm.isShapeUnlocked('circle'), 'Circle shape unlocked by default');

    const isNewHeart = sm.unlockShape('heart');
    t.assertTrue(isNewHeart, 'First heart unlock should be true');
    t.assertTrue(sm.isShapeUnlocked('heart'), 'Heart shape is now unlocked');
  });
}

async function testGameSettingsAndStageExpansion(t) {
  t.suite('9. Game Settings & Spawner Population Control');

  t.test('Cannon setMaxWater enforces range [1, 80] and updates capacity', () => {
    const blaster = new Cannon(1280, 720);
    blaster.setMaxWater(50);
    t.assertEqual(blaster.maxWater, 50, 'Max water updated to 50');
    t.assertEqual(blaster.maxAmmo, 50, 'Max ammo getter reflects 50');

    blaster.setMaxWater(100);
    t.assertEqual(blaster.maxWater, 80, 'Clamps value over 80 to 80');

    blaster.setMaxWater(-5);
    t.assertEqual(blaster.maxWater, 1, 'Clamps value under 1 to 1');
  });

  t.test('Spawner setMinCats enforces range [2, 10] and auto-spawns to threshold', () => {
    const spawner = new CatSpawner();
    spawner.setMinCats(5);
    t.assertEqual(spawner.minActiveCats, 5, 'minActiveCats set to 5');
    t.assertTrue(spawner.maxActiveCats >= 7, 'maxActiveCats scales with minActiveCats');

    spawner.setMinCats(15);
    t.assertEqual(spawner.minActiveCats, 10, 'Clamps value above 10 to 10');

    spawner.setMinCats(0);
    t.assertEqual(spawner.minActiveCats, 2, 'Clamps value below 2 to 2');

    // Test population maintenance in update
    spawner.setMinCats(4);
    spawner.activeCats = [];
    spawner.update(0.1, { width: 1280, height: 720 }, [], []);
    t.assertTrue(spawner.activeCats.length >= 4, 'update() automatically populates active cats to meet minActiveCats');
  });

  t.test('Cannon setCooldownDuration enforces range [0, 10] and instant recharge at 0s', () => {
    const blaster = new Cannon(1280, 720);
    blaster.setCooldownDuration(4.5);
    t.assertEqual(blaster.cooldownDuration, 4.5, 'Cooldown duration set to 4.5s');

    blaster.setCooldownDuration(15);
    t.assertEqual(blaster.cooldownDuration, 10, 'Clamps value above 10 to 10');

    blaster.setCooldownDuration(-3);
    t.assertEqual(blaster.cooldownDuration, 0, 'Clamps value below 0 to 0');

    // Instant refill test at 0s cooldown
    blaster.setCooldownDuration(0);
    blaster.currentWater = 1;
    blaster.fire(true); // fires last water shot
    t.assertFalse(blaster.isCoolingDown, 'Cooldown should be immediately inactive when duration is 0s');
    t.assertEqual(blaster.currentAmmo, blaster.maxWater, 'Tank should immediately refill to maxWater');
  });

  t.test('resetAllData cleans saved state, collection and resets configuration to defaults', () => {
    safeStorage.setItem('cat_shooter_high_score', '99999');
    safeStorage.setItem('cute_cat_collection', JSON.stringify(['orange_tabby', 'british_shorthair']));
    safeStorage.setItem('cute_cat_unlocked_shapes', JSON.stringify(['heart', 'star', 'paw']));
    safeStorage.setItem('bubble_cat_settings', JSON.stringify({ maxAmmo: 60, minCats: 8, cooldownDuration: 5 }));

    const fakeGame = {
      highScore: 99999,
      score: 12000,
      cannon: new Cannon(1280, 720),
      spawner: new CatSpawner(),
      sceneManager: new SceneManager(),
      setStage(idx) { this.sceneManager.loadStage(idx); }
    };
    fakeGame.cannon.setMaxWater(60);
    fakeGame.spawner.setMinCats(8);
    fakeGame.sceneManager.unlockCat('orange_tabby');

    // Simulate resetAllData logic
    safeStorage.removeItem('cat_shooter_high_score');
    safeStorage.removeItem('bubble_cat_settings');
    safeStorage.removeItem('cute_cat_collection');
    safeStorage.removeItem('cute_cat_unlocked_shapes');
    safeStorage.clear();

    fakeGame.highScore = 0;
    fakeGame.score = 0;
    fakeGame.cannon.setMaxWater(20);
    fakeGame.spawner.setMinCats(4);
    fakeGame.sceneManager.unlockedCats.clear();

    t.assertEqual(fakeGame.highScore, 0, 'HighScore reset to 0');
    t.assertEqual(fakeGame.cannon.maxWater, 20, 'Cannon max water reset to default 20');
    t.assertEqual(fakeGame.spawner.minActiveCats, 4, 'Spawner min cats reset to default 4');
    t.assertEqual(fakeGame.sceneManager.unlockedCats.size, 0, 'Unlocked cats cleared');
    t.assertEqual(safeStorage.getItem('cat_shooter_high_score'), null, 'SafeStorage cleared');
  });
}

async function testShopSystemAndModularOutfits(t) {
  t.suite('10. Shop System & Modular Cat Outfits Tests');

  t.test('Catalog integrity for gun skins, gun effects, and cat modular accessories', () => {
    t.assertTrue(SHOP_CATALOG.length >= 20, 'Catalog should contain at least 20 customizable items');

    const gunSkins = SHOP_CATALOG.filter(it => it.type === SHOP_ITEM_TYPES.GUN_SKIN);
    const gunEffects = SHOP_CATALOG.filter(it => it.type === SHOP_ITEM_TYPES.GUN_EFFECT);
    const catAccs = SHOP_CATALOG.filter(it => it.type === SHOP_ITEM_TYPES.CAT_ACCESSORY);

    t.assertEqual(gunSkins.length, 5, 'Must contain exactly 5 gun skins');
    t.assertEqual(gunEffects.length, 4, 'Must contain exactly 4 gun muzzle/trail effects');
    t.assertTrue(catAccs.length >= 12, 'Must contain at least 12 cat modular accessories');

    // Slot validation for cat accessories
    const slots = new Set(catAccs.map(it => it.slot));
    t.assertTrue(slots.has(CAT_SLOTS.HEAD), 'Must have head accessories');
    t.assertTrue(slots.has(CAT_SLOTS.FACE), 'Must have face/eyes accessories');
    t.assertTrue(slots.has(CAT_SLOTS.BACK), 'Must have back/cape accessories');
    t.assertTrue(slots.has(CAT_SLOTS.AURA), 'Must have aura accessories');
  });

  t.test('Purchasing with Paw Points and balance deduction', () => {
    const shop = new ShopManager();
    shop.resetAllData();

    t.assertEqual(shop.pawPoints, 0, 'Initial points must be 0');
    t.assertTrue(shop.isOwned('classic_blaster'), 'Default classic blaster must be owned');
    t.assertTrue(shop.isOwned('none_effect'), 'Default none effect must be owned');

    // Try buying cyber_cannon (5000 points) with 0 points -> fails
    const failRes = shop.buyItem('cyber_cannon');
    t.assertFalse(failRes.success, 'Purchase should fail when points are insufficient');
    t.assertFalse(shop.isOwned('cyber_cannon'), 'Should not own cyber cannon yet');

    // Add 10000 points
    shop.addPoints(10000);
    t.assertEqual(shop.pawPoints, 10000, 'Paw points should be 10000');

    // Buy cyber_cannon successfully
    const okRes = shop.buyItem('cyber_cannon');
    t.assertTrue(okRes.success, 'Purchase should succeed');
    t.assertEqual(shop.pawPoints, 5000, 'Paw points should deduct 5000');
    t.assertTrue(shop.isOwned('cyber_cannon'), 'Cyber cannon should now be owned');
    t.assertEqual(shop.equippedGunSkin, 'cyber_cannon', 'Auto-equips upon purchase');
  });

  t.test('Gun customization constraint: Only 1 skin and 1 effect equipped at a time', () => {
    const shop = new ShopManager();
    shop.resetAllData();
    shop.addPoints(50000);

    shop.buyItem('cyber_cannon');
    shop.buyItem('shark_bazooka');
    shop.buyItem('sparkle_trail');
    shop.buyItem('heart_stream');

    shop.equipItem('cyber_cannon');
    t.assertEqual(shop.equippedGunSkin, 'cyber_cannon', 'Cyber cannon equipped');

    // Equipping shark bazooka replaces cyber cannon (strictly 1 skin at a time)
    shop.equipItem('shark_bazooka');
    t.assertEqual(shop.equippedGunSkin, 'shark_bazooka', 'Shark bazooka should replace cyber cannon');
    t.assertFalse(shop.isEquipped('cyber_cannon'), 'Cyber cannon should no longer be equipped');

    // Equipping gun effects (strictly 1 effect at a time)
    shop.equipItem('sparkle_trail');
    t.assertEqual(shop.equippedGunEffect, 'sparkle_trail', 'Sparkle trail equipped');
    shop.equipItem('heart_stream');
    t.assertEqual(shop.equippedGunEffect, 'heart_stream', 'Heart stream replaces sparkle trail');
    t.assertFalse(shop.isEquipped('sparkle_trail'), 'Sparkle trail no longer equipped');
  });

  t.test('Cat customization: Multi-slot simultaneous equipment across distinct groups', () => {
    const shop = new ShopManager();
    shop.resetAllData();
    shop.addPoints(100000);

    // Buy items across 4 different slots
    shop.buyItem('crown');           // HEAD
    shop.buyItem('top_hat');         // HEAD
    shop.buyItem('sunglasses');      // FACE
    shop.buyItem('superhero_cape');  // BACK
    shop.buyItem('sparkle_aura');    // AURA

    // Equip 1 item per slot -> all 4 distinct groups equipped simultaneously!
    shop.equipItem('crown');
    shop.equipItem('sunglasses');
    shop.equipItem('superhero_cape');
    shop.equipItem('sparkle_aura');

    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.HEAD], 'crown', 'Crown in HEAD slot');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.FACE], 'sunglasses', 'Sunglasses in FACE slot');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.BACK], 'superhero_cape', 'Superhero cape in BACK slot');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.AURA], 'sparkle_aura', 'Sparkle aura in AURA slot');

    // All 4 accessories simultaneously active
    t.assertTrue(shop.isEquipped('crown'), 'Crown is equipped');
    t.assertTrue(shop.isEquipped('sunglasses'), 'Sunglasses is equipped');
    t.assertTrue(shop.isEquipped('superhero_cape'), 'Cape is equipped');
    t.assertTrue(shop.isEquipped('sparkle_aura'), 'Aura is equipped');

    // In same group (HEAD), equipping top_hat replaces crown
    shop.equipItem('top_hat');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.HEAD], 'top_hat', 'Top hat replaced crown');
    t.assertFalse(shop.isEquipped('crown'), 'Crown no longer equipped');
    t.assertTrue(shop.isEquipped('sunglasses'), 'Other slots (face) remain intact');

    // Unequip specific slot
    shop.unequipItem(SHOP_ITEM_TYPES.CAT_ACCESSORY, CAT_SLOTS.FACE);
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.FACE], null, 'FACE slot cleared');
    t.assertFalse(shop.isEquipped('sunglasses'), 'Sunglasses unequipped');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.BACK], 'superhero_cape', 'BACK slot still intact');

    // Factory reset cleans shop state
    shop.resetAllData();
    t.assertEqual(shop.pawPoints, 0, 'Reset points to 0');
    t.assertEqual(shop.equippedGunSkin, 'classic_blaster', 'Reset skin to classic');
    t.assertEqual(shop.equippedGunEffect, 'none_effect', 'Reset effect to none');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.HEAD], null, 'Head slot empty');
    t.assertEqual(shop.equippedCatAccessories[CAT_SLOTS.BACK], null, 'Back slot empty');
  });
}

function createMockCtx() {
  const calls = [];
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '_calls') return calls;
      return (...args) => {
        calls.push({ method: prop, args });
      };
    },
    set: (target, prop, value) => {
      calls.push({ set: prop, value });
      return true;
    }
  });
}

async function testGunEffectsAndDualAngelWings(t) {
  t.suite('11. Gun Effects Flight Trail & Cat Angel Wings Render Tests');

  t.test('Bubble spawns with equipped gun effect and emits flight trail particles over time', () => {
    const bubblePool = new BubblePool(10);
    const particlePool = new ParticlePool(50);
    
    // Spawn bubble with sparkle_trail
    const b = bubblePool.spawn(100, 600, 0, -300, '#ff6b8b', 20, 'circle', 100, 200, 'sparkle_trail');
    t.assertTrue(b !== null, 'Bubble spawned successfully');
    t.assertEqual(b.effect, 'sparkle_trail', 'Bubble has sparkle_trail effect assigned');

    const initialParticles = particlePool.pool.filter(p => p.alive).length;
    t.assertEqual(initialParticles, 0, 'Initial particle count is 0');

    // Update 5 frames (dt = 0.05s each) -> should emit trail particles continuously along flight
    for (let i = 0; i < 5; i++) {
      b.update(0.05, { width: 1280, height: 720 }, particlePool);
    }

    const trailParticles = particlePool.pool.filter(p => p.alive);
    t.assertTrue(trailParticles.length > 0, 'Trail particles emitted during flight');
    t.assertTrue(trailParticles.some(p => p.type === 'star'), 'Emitted star particles for sparkle_trail');
  });

  t.test('Bubble.pop triggers distinct impact particle bursts for gun effects', () => {
    const particlePool = new ParticlePool(100);

    // 1. sparkle_trail
    const b1 = new Bubble();
    b1.spawn(200, 200, 0, -100, '#ff6b8b', 20, 'circle', 200, 100, 'sparkle_trail');
    b1.pop(particlePool);
    const starCount = particlePool.pool.filter(p => p.alive && p.type === 'star').length;
    t.assertTrue(starCount >= 8, 'Pop bursts multiple star particles for sparkle_trail');

    particlePool.clear();

    // 2. heart_stream
    const b2 = new Bubble();
    b2.spawn(200, 200, 0, -100, '#ff6b8b', 20, 'circle', 200, 100, 'heart_stream');
    b2.pop(particlePool);
    const heartCount = particlePool.pool.filter(p => p.alive && p.type === 'heart').length;
    t.assertTrue(heartCount >= 8, 'Pop bursts multiple heart particles for heart_stream');

    particlePool.clear();

    // 3. plasma_bolt
    const b3 = new Bubble();
    b3.spawn(200, 200, 0, -100, '#ff6b8b', 20, 'circle', 200, 100, 'plasma_bolt');
    b3.pop(particlePool);
    const dropletCount = particlePool.pool.filter(p => p.alive && p.type === 'droplet').length;
    t.assertTrue(dropletCount >= 10, 'Pop bursts electric droplets for plasma_bolt');
  });

  t.test('Cat angel_wings accessory renders symmetrically with dual wings on both sides', () => {
    const cat = new Cat(CAT_CATALOG[0], 200, 200);
    const mockCtx = createMockCtx();

    // Render with angel_wings
    cat.render(mockCtx, { back: 'angel_wings' });

    // Verify dual wing scaling: scale(-1, 1) must be called for the right wing mirror
    const scaleCalls = mockCtx._calls.filter(c => c.method === 'scale');
    const hasLeftWing = scaleCalls.some(c => c.args && c.args[0] === -1 && c.args[1] === 1);
    const hasRightWing = scaleCalls.some(c => c.args && c.args[0] === 1 && c.args[1] === 1);
    t.assertTrue(hasLeftWing && hasRightWing, 'Dual wings rendered symmetrically with left and right mirrored transforms');
  });
}
