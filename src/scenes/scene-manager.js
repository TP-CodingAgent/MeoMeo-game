/**
 * Cute Cat Bubble Shooter - Scene & Environment Manager
 * Controls stage rendering with elevated platforms, tall trees,
 * animated flying birds in the sunny garden, and Cat Encyclopedia & Shape Unlocks.
 */

import { Prop } from '../entities/prop.js';
import { CAT_CATALOG, BUBBLE_SHAPES } from '../data/cat-catalog.js';
import { safeStorage } from '../utils/safe-storage.js';
import { randomRange, randomChoice } from '../utils/math-physics.js';

export const STAGE_CONFIGS = [
  {
    id: 1,
    name: 'Phòng Khách Ấm Cúng',
    description: 'Kệ sách trên cao, đồng hồ quả lắc mèo và ghế sofa êm ái',
    bgColor: '#fdfbf7',
    floorColor: '#e0c097',
    props: [
      { id: 'shelf_left', type: 'shelf', x: 320, y: 250, width: 240, height: 26, isPlatform: true, label: 'Kệ Sách Treo Tường' },
      { id: 'shelf_right', type: 'shelf', x: 960, y: 230, width: 220, height: 26, isPlatform: true, label: 'Kệ Trưng Bày Lọ Hoa' },
      { id: 'sofa_1', type: 'sofa', x: 420, y: 520, width: 220, height: 130, label: 'Ghế Sofa' },
      { id: 'box_1', type: 'box', x: 760, y: 540, width: 130, height: 100, label: 'Thùng Giấy' },
      { id: 'plant_1', type: 'plant', x: 1100, y: 510, width: 110, height: 140, label: 'Chậu Cây Trầu Bà' }
    ]
  },
  {
    id: 2,
    name: 'Phòng Ngủ Kẹo Ngọt',
    description: 'Tủ gỗ cao chót vót, kệ đồ chơi và đệm lười nhung pastel',
    bgColor: '#f3e5f5',
    floorColor: '#d7ccc8',
    props: [
      { id: 'wardrobe_1', type: 'wardrobe', x: 220, y: 340, width: 190, height: 280, isPlatform: true, label: 'Tủ Quần Áo Cao' },
      { id: 'shelf_toys', type: 'shelf', x: 780, y: 230, width: 250, height: 26, isPlatform: true, label: 'Kệ Gấu Bông' },
      { id: 'cushion_1', type: 'cushion', x: 480, y: 540, width: 160, height: 90, label: 'Đệm Lười Nhút Nhát' },
      { id: 'box_2', type: 'box', x: 780, y: 530, width: 140, height: 110, label: 'Rương Đồ Chơi' },
      { id: 'plant_2', type: 'plant', x: 1100, y: 520, width: 120, height: 130, label: 'Chậu Cây Bàn Học' }
    ]
  },
  {
    id: 3,
    name: 'Khu Vườn Nắng Ấm',
    description: 'Cây táo cao vút, chim bay lượn, mèo nấp trong vòm lá và dây phơi khăn',
    bgColor: '#e3f2fd',
    floorColor: '#a8e6cf',
    props: [
      { id: 'tree_left', type: 'branch', x: 260, y: 220, width: 340, height: 50, isPlatform: true, label: 'Cành Táo Cổ Thụ' },
      { id: 'tree_right', type: 'branch', x: 1060, y: 200, width: 260, height: 45, isPlatform: true, label: 'Tán Cây Vườn Phải' },
      { id: 'clothesline_1', type: 'clothesline', x: 670, y: 240, width: 280, height: 55, isPlatform: true, label: 'Dây Phơi Khăn' },
      { id: 'fence_1', type: 'fence', x: 360, y: 510, width: 200, height: 120, label: 'Hàng Rào Gỗ' },
      { id: 'bush_1', type: 'bush', x: 740, y: 530, width: 170, height: 110, label: 'Bụi Cây Hoa' },
      { id: 'box_3', type: 'box', x: 1080, y: 540, width: 130, height: 100, label: 'Thùng Gỗ Sân Vườn' }
    ]
  },
  {
    id: 4,
    name: 'Bãi Biển Nhiệt Đới',
    description: 'Cây dừa nghiêng biển, võng treo êm ái, lâu đài cát và mòng biển chao liệng',
    bgColor: '#dff9fb',
    floorColor: '#f5cd79',
    props: [
      { id: 'palm_left', type: 'palm_tree', x: 260, y: 220, width: 260, height: 50, isPlatform: true, label: 'Cây Dừa Nghiêng Biển' },
      { id: 'hammock_right', type: 'hammock', x: 980, y: 240, width: 240, height: 50, isPlatform: true, label: 'Võng Treo Bãi Biển' },
      { id: 'umbrella_1', type: 'beach_umbrella', x: 380, y: 490, width: 140, height: 140, label: 'Dù Che Nắng' },
      { id: 'sandcastle_1', type: 'sandcastle', x: 720, y: 530, width: 150, height: 110, label: 'Lâu Đài Cát' },
      { id: 'chair_1', type: 'beach_chair', x: 1080, y: 520, width: 140, height: 90, label: 'Ghế Tắm Nắng' }
    ]
  },
  {
    id: 5,
    name: 'Dưới Lòng Đại Dương',
    description: 'Rạn san hô rực rỡ, boong tàu đắm cổ, bọt nước li ti và rương báu ngọc trai',
    bgColor: '#0a3d62',
    floorColor: '#f8a5c2',
    props: [
      { id: 'coral_shelf', type: 'coral_rock', x: 300, y: 230, width: 250, height: 45, isPlatform: true, label: 'Mỏm Đá San Hô Cao' },
      { id: 'ship_deck', type: 'sunken_ship', x: 960, y: 220, width: 260, height: 50, isPlatform: true, label: 'Boong Tàu Đắm Cổ' },
      { id: 'seaweed_1', type: 'seaweed', x: 200, y: 490, width: 120, height: 140, label: 'Bụi Rong Biển' },
      { id: 'chest_1', type: 'treasure_chest', x: 620, y: 530, width: 130, height: 100, label: 'Rương Kho Báu' },
      { id: 'clam_1', type: 'clam_shell', x: 1020, y: 530, width: 140, height: 110, label: 'Vỏ Sò Ngọc Trai' }
    ]
  },
  {
    id: 6,
    name: 'Sa Mạc Hoàng Hôn',
    description: 'Thảm bay thần thoại lơ lửng, cổng đá cổ đại, cây xương rồng và ốc đảo hoàng hôn',
    bgColor: '#fab1a0',
    floorColor: '#e17055',
    props: [
      { id: 'carpet_magic', type: 'flying_carpet', x: 320, y: 230, width: 240, height: 36, isPlatform: true, label: 'Thảm Bay Thần Thoại' },
      { id: 'arch_desert', type: 'desert_arch', x: 980, y: 220, width: 260, height: 60, isPlatform: true, label: 'Cổng Đá Sa Mạc' },
      { id: 'cactus_1', type: 'cactus', x: 240, y: 490, width: 110, height: 140, label: 'Cây Xương Rồng Nở Hoa' },
      { id: 'tent_1', type: 'oasis_tent', x: 680, y: 510, width: 170, height: 130, label: 'Lều Du Mục Ốc Đảo' },
      { id: 'jug_1', type: 'water_jug', x: 1080, y: 540, width: 100, height: 90, label: 'Chum Gốm Cổ Đại' }
    ]
  },
  {
    id: 7,
    name: 'Trạm Vũ Trụ Không Gian',
    description: 'Bệ thép không gian không trọng lực, vệ tinh phát sóng, đĩa bay UFO và xe thám hiểm',
    bgColor: '#0c0c24',
    floorColor: '#57606f',
    props: [
      { id: 'space_deck', type: 'space_platform', x: 320, y: 230, width: 250, height: 40, isPlatform: true, label: 'Bệ Thép Không Gian' },
      { id: 'sat_1', type: 'satellite', x: 980, y: 220, width: 260, height: 50, isPlatform: true, label: 'Vệ Tinh Quỹ Đạo' },
      { id: 'ufo_1', type: 'mini_ufo', x: 260, y: 510, width: 140, height: 100, label: 'Đĩa Bay Mini Dễ Thương' },
      { id: 'rover_1', type: 'lunar_rover', x: 680, y: 520, width: 160, height: 110, label: 'Xe Thám Hiểm Mặt Trăng' },
      { id: 'crate_space', type: 'space_crate', x: 1080, y: 540, width: 120, height: 100, label: 'Thùng Năng Lượng' }
    ]
  },
  {
    id: 8,
    name: 'Xứ Sở Băng Tuyết',
    description: 'Cầu băng pha lê lấp lánh, tháp lâu đài tuyết, người tuyết quàng khăn đỏ và lều igloo',
    bgColor: '#dfe4ea',
    floorColor: '#f1f2f6',
    props: [
      { id: 'ice_bridge', type: 'ice_shelf', x: 300, y: 220, width: 250, height: 45, isPlatform: true, label: 'Cầu Băng Pha Lê' },
      { id: 'spire_snow', type: 'snow_pinnacle', x: 960, y: 210, width: 250, height: 55, isPlatform: true, label: 'Tháp Lâu Đài Tuyết' },
      { id: 'snowman_1', type: 'snowman', x: 280, y: 510, width: 120, height: 130, label: 'Người Tuyết Quàng Khăn' },
      { id: 'igloo_1', type: 'igloo', x: 660, y: 520, width: 170, height: 110, label: 'Lều Tuyết Igloo' },
      { id: 'pine_1', type: 'pine_tree', x: 1060, y: 490, width: 130, height: 140, label: 'Cây Thông Phủ Tuyết' }
    ]
  }
];

export class SceneManager {
  constructor() {
    this.currentStageIndex = 0;
    this.currentStage = STAGE_CONFIGS[0];
    this.props = [];
    this.platforms = [];
    this.loadStage(0);

    // Collection storage
    this.unlockedCats = new Set();
    this.unlockedShapes = new Set(['circle']);
    this.loadCollection();
    this.loadShapes();

    // Ambient environmental systems
    this.animTime = 0;
    this.birds = [];
    this.birdSpawnTimer = 0;
    this.seagulls = [];
    this.oceanBubbles = [];
    this.fishes = [];
    this.spaceStars = [];
    this.shootingStars = [];
    this.snowflakes = [];
  }

  loadStage(index) {
    this.currentStageIndex = Math.max(0, Math.min(STAGE_CONFIGS.length - 1, index));
    this.currentStage = STAGE_CONFIGS[this.currentStageIndex];
    this.props = this.currentStage.props.map(p => new Prop(p));
    this.platforms = this.props.filter(p => p.isPlatform);

    // Reset ambients
    this.birds = [];
    this.seagulls = [];
    this.oceanBubbles = [];
    this.fishes = [];
    this.shootingStars = [];
    this.snowflakes = [];

    // Pre-populate space stars for Space stage (index 6)
    if (this.currentStageIndex === 6) {
      this.spaceStars = [];
      for (let i = 0; i < 45; i++) {
        this.spaceStars.push({
          x: Math.random() * 1280,
          y: Math.random() * 520,
          radius: randomRange(1, 2.8),
          phase: Math.random() * Math.PI * 2,
          speed: randomRange(2, 5)
        });
      }
    }

    // Pre-populate ambient bubbles for Ocean stage (index 4)
    if (this.currentStageIndex === 4) {
      this.oceanBubbles = [];
      for (let i = 0; i < 22; i++) {
        this.oceanBubbles.push({
          x: Math.random() * 1280,
          y: randomRange(120, 680),
          vy: randomRange(35, 75),
          radius: randomRange(3, 8),
          wobble: Math.random() * Math.PI * 2
        });
      }
    }

    // Pre-populate snowflakes for Arctic stage (index 7)
    if (this.currentStageIndex === 7) {
      this.snowflakes = [];
      for (let i = 0; i < 40; i++) {
        this.snowflakes.push({
          x: Math.random() * 1280,
          y: Math.random() * 700,
          vy: randomRange(45, 95),
          radius: randomRange(2, 5),
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  nextStage() {
    this.loadStage((this.currentStageIndex + 1) % STAGE_CONFIGS.length);
  }

  loadCollection() {
    try {
      const data = safeStorage.getItem('cute_cat_collection');
      if (data) {
        const arr = JSON.parse(data);
        if (Array.isArray(arr)) {
          this.unlockedCats = new Set(arr);
        }
      }
    } catch (e) {
      this.unlockedCats = new Set();
    }
  }

  saveCollection() {
    try {
      const arr = Array.from(this.unlockedCats);
      safeStorage.setItem('cute_cat_collection', JSON.stringify(arr));
    } catch (e) {
      console.warn('Unable to persist cat collection', e);
    }
  }

  loadShapes() {
    try {
      const data = safeStorage.getItem('cute_cat_unlocked_shapes');
      if (data) {
        const arr = JSON.parse(data);
        if (Array.isArray(arr)) {
          this.unlockedShapes = new Set(arr);
        }
      }
      this.unlockedShapes.add('circle');
    } catch (e) {
      this.unlockedShapes = new Set(['circle']);
    }
  }

  saveShapes() {
    try {
      const arr = Array.from(this.unlockedShapes);
      safeStorage.setItem('cute_cat_unlocked_shapes', JSON.stringify(arr));
    } catch (e) {
      console.warn('Unable to persist shapes', e);
    }
  }

  unlockCat(catId) {
    const isNew = !this.unlockedCats.has(catId);
    if (isNew) {
      this.unlockedCats.add(catId);
      this.saveCollection();
    }
    return isNew;
  }

  unlockShape(shapeId) {
    if (!shapeId || !BUBBLE_SHAPES[shapeId]) return false;
    const isNew = !this.unlockedShapes.has(shapeId);
    if (isNew) {
      this.unlockedShapes.add(shapeId);
      this.saveShapes();
    }
    return isNew;
  }

  isCatUnlocked(catId) {
    return this.unlockedCats.has(catId);
  }

  isShapeUnlocked(shapeId) {
    return this.unlockedShapes.has(shapeId);
  }

  getUnlockedShapesList() {
    return Array.from(this.unlockedShapes).map(id => BUBBLE_SHAPES[id]).filter(Boolean);
  }

  getCollectionProgress() {
    return {
      unlockedCount: this.unlockedCats.size,
      totalCount: CAT_CATALOG.length,
      percentage: Math.round((this.unlockedCats.size / CAT_CATALOG.length) * 100)
    };
  }

  update(dt) {
    this.animTime += dt;

    // 1. Garden Stage (Index 2): Flying songbirds
    if (this.currentStageIndex === 2) {
      this.birdSpawnTimer += dt;
      if (this.birdSpawnTimer >= 4.5 && this.birds.length < 4) {
        this.birdSpawnTimer = 0;
        const birdColors = ['#38ada9', '#e55039', '#f6b93b', '#4a69bd'];
        this.birds.push({
          x: -40,
          y: randomRange(70, 160),
          vx: randomRange(110, 160),
          color: birdColors[Math.floor(Math.random() * birdColors.length)],
          wingPhase: Math.random() * Math.PI,
          wingSpeed: 11
        });
      }

      for (let i = this.birds.length - 1; i >= 0; i--) {
        const b = this.birds[i];
        b.x += b.vx * dt;
        b.wingPhase += b.wingSpeed * dt;
        if (b.x > 1340) {
          this.birds.splice(i, 1);
        }
      }
    }

    // 2. Beach Stage (Index 3): Flying white seagulls
    if (this.currentStageIndex === 3) {
      this.birdSpawnTimer += dt;
      if (this.birdSpawnTimer >= 4.0 && this.seagulls.length < 4) {
        this.birdSpawnTimer = 0;
        this.seagulls.push({
          x: -30,
          y: randomRange(60, 180),
          vx: randomRange(95, 140),
          wingPhase: Math.random() * Math.PI,
          wingSpeed: 8
        });
      }
      for (let i = this.seagulls.length - 1; i >= 0; i--) {
        const s = this.seagulls[i];
        s.x += s.vx * dt;
        s.wingPhase += s.wingSpeed * dt;
        if (s.x > 1340) {
          this.seagulls.splice(i, 1);
        }
      }
    }

    // 3. Ocean Stage (Index 4): Rising bubbles & tropical fish
    if (this.currentStageIndex === 4) {
      for (const b of this.oceanBubbles) {
        b.y -= b.vy * dt;
        b.wobble += dt * 3;
        b.x += Math.sin(b.wobble) * 20 * dt;
        if (b.y < 80) {
          b.y = 660;
          b.x = Math.random() * 1280;
        }
      }
    }

    // 4. Space Stage (Index 6): Twinkling stars & meteors
    if (this.currentStageIndex === 6) {
      for (const s of this.spaceStars) {
        s.phase += dt * s.speed;
      }
      this.birdSpawnTimer += dt;
      if (this.birdSpawnTimer >= 5.0 && this.shootingStars.length < 2) {
        this.birdSpawnTimer = 0;
        this.shootingStars.push({
          x: randomRange(100, 900),
          y: randomRange(40, 180),
          vx: 380,
          vy: 180,
          life: 0.8,
          maxLife: 0.8
        });
      }
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const star = this.shootingStars[i];
        star.x += star.vx * dt;
        star.y += star.vy * dt;
        star.life -= dt;
        if (star.life <= 0) {
          this.shootingStars.splice(i, 1);
        }
      }
    }

    // 5. Arctic Stage (Index 7): Gentle falling snowflakes
    if (this.currentStageIndex === 7) {
      for (const sf of this.snowflakes) {
        sf.y += sf.vy * dt;
        sf.phase += dt * 2;
        sf.x += Math.sin(sf.phase) * 25 * dt;
        if (sf.y > 700) {
          sf.y = -10;
          sf.x = Math.random() * 1280;
        }
      }
    }
  }

  renderBackground(ctx, width = 1280, height = 720) {
    ctx.fillStyle = this.currentStage.bgColor;
    ctx.fillRect(0, 0, width, height);

    switch (this.currentStageIndex) {
      case 0:
        this.renderLivingRoomBackground(ctx, width, height);
        break;
      case 1:
        this.renderBedroomBackground(ctx, width, height);
        break;
      case 2:
        this.renderGardenBackground(ctx, width, height);
        break;
      case 3:
        this.renderBeachBackground(ctx, width, height);
        break;
      case 4:
        this.renderOceanBackground(ctx, width, height);
        break;
      case 5:
        this.renderDesertBackground(ctx, width, height);
        break;
      case 6:
        this.renderSpaceBackground(ctx, width, height);
        break;
      case 7:
        this.renderIceBackground(ctx, width, height);
        break;
      default:
        this.renderLivingRoomBackground(ctx, width, height);
        break;
    }

    // Floor surface
    ctx.fillStyle = this.currentStage.floorColor;
    ctx.fillRect(0, 560, width, height - 560);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.lineTo(width, 560);
    ctx.stroke();
  }

  renderLivingRoomBackground(ctx, width, height) {
    // Cat Wall Clock
    ctx.save();
    ctx.translate(640, 130);
    ctx.fillStyle = '#fffae6';
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4a373';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#d4a373';
    ctx.beginPath();
    ctx.moveTo(-24, -28);
    ctx.lineTo(-32, -48);
    ctx.lineTo(-10, -36);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10, -36);
    ctx.lineTo(32, -48);
    ctx.lineTo(24, -28);
    ctx.fill();

    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -18);
    ctx.moveTo(0, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();

    const pendulumAngle = Math.sin(this.animTime * 3.3) * 0.35;
    ctx.rotate(pendulumAngle);
    ctx.strokeStyle = '#d4a373';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.quadraticCurveTo(6, 65, 0, 78);
    ctx.stroke();
    ctx.restore();

    // Window
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(140, 80, 140, 150);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(140, 80, 140, 150);

    // Floor rug
    ctx.fillStyle = '#ffeaa7';
    ctx.beginPath();
    ctx.ellipse(width / 2, 600, 380, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fdcb6e';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  renderBedroomBackground(ctx, width, height) {
    ctx.strokeStyle = '#ffeaa7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 70);
    ctx.quadraticCurveTo(width / 2, 120, width - 100, 70);
    ctx.stroke();

    const starPositions = [200, 380, 560, 740, 920, 1100];
    for (const px of starPositions) {
      const py = 70 + Math.sin((px / width) * Math.PI) * 45;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#c5cae9';
    ctx.fillRect(940, 60, 180, 170);
    ctx.fillStyle = '#7986cb';
    ctx.fillRect(920, 50, 25, 190);
    ctx.fillRect(1115, 50, 25, 190);

    ctx.fillStyle = '#f8bbd0';
    ctx.beginPath();
    ctx.roundRect(400, 570, 520, 65, 25);
    ctx.fill();
  }

  renderGardenBackground(ctx, width, height) {
    // Fluffy clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    this.drawCloud(ctx, 200, 90, 48);
    this.drawCloud(ctx, 640, 70, 58);
    this.drawCloud(ctx, 1140, 100, 44);

    // Distant green rolling hills
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.quadraticCurveTo(340, 410, 680, 560);
    ctx.fill();

    ctx.fillStyle = '#66bb6a';
    ctx.beginPath();
    ctx.moveTo(550, 560);
    ctx.quadraticCurveTo(900, 440, 1280, 560);
    ctx.fill();

    // Friendly Sun
    ctx.fillStyle = '#fff59d';
    ctx.beginPath();
    ctx.arc(80, 80, 45, 0, Math.PI * 2);
    ctx.fill();

    // TALL TREES (Cây cao che bóng mát bên trái & phải)
    // Left Tall Tree Trunk & Canopy
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.moveTo(100, 560);
    ctx.lineTo(130, 250);
    ctx.lineTo(170, 250);
    ctx.lineTo(190, 560);
    ctx.closePath();
    ctx.fill();

    // Big green canopy on left
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(160, 170, 120, 0, Math.PI * 2);
    ctx.arc(280, 150, 90, 0, Math.PI * 2);
    ctx.arc(80, 180, 80, 0, Math.PI * 2);
    ctx.fill();

    // Soft canopy highlights
    ctx.fillStyle = '#7bed9f';
    ctx.beginPath();
    ctx.arc(140, 130, 60, 0, Math.PI * 2);
    ctx.arc(260, 120, 45, 0, Math.PI * 2);
    ctx.fill();

    // Right Tall Tree Trunk & Canopy
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.moveTo(1120, 560);
    ctx.lineTo(1140, 220);
    ctx.lineTo(1180, 220);
    ctx.lineTo(1210, 560);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(1140, 150, 110, 0, Math.PI * 2);
    ctx.arc(1020, 170, 85, 0, Math.PI * 2);
    ctx.arc(1220, 160, 75, 0, Math.PI * 2);
    ctx.fill();

    // Render Flying Birds in Sky
    this.renderBirds(ctx);
  }

  renderBirds(ctx) {
    for (const b of this.birds) {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Bird body
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Yellow beak
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(11, -2);
      ctx.lineTo(18, 0);
      ctx.lineTo(11, 3);
      ctx.closePath();
      ctx.fill();

      // Cute eye
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(7, -2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Flapping wings
      const wingFlap = Math.sin(b.wingPhase) * 9;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(-6, -11 + wingFlap);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  drawCloud(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.arc(cx + radius * 0.7, cy - radius * 0.2, radius * 0.75, 0, Math.PI * 2);
    ctx.arc(cx - radius * 0.7, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.arc(cx + radius * 1.3, cy + radius * 0.1, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Stage 4: Tropical Beach ---
  renderBeachBackground(ctx, width, height) {
    // Sky clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.drawCloud(ctx, 300, 80, 42);
    this.drawCloud(ctx, 880, 95, 52);

    // Smiling Sun
    ctx.fillStyle = '#fffa65';
    ctx.beginPath();
    ctx.arc(100, 80, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff9f1a';
    ctx.beginPath();
    ctx.arc(100, 80, 46, 0, Math.PI * 2);
    ctx.stroke();

    // Ocean horizon & waves
    ctx.fillStyle = '#17c0eb';
    ctx.fillRect(0, 420, width, 140);

    ctx.fillStyle = '#18dcff';
    ctx.beginPath();
    ctx.moveTo(0, 470);
    const waveOffset = (Date.now() / 400) % (Math.PI * 2);
    for (let x = 0; x <= width; x += 40) {
      const y = 470 + Math.sin(x * 0.02 + waveOffset) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, 560);
    ctx.lineTo(0, 560);
    ctx.closePath();
    ctx.fill();

    // Distant sailboat
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(700, 410);
    ctx.lineTo(720, 380);
    ctx.lineTo(720, 410);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.roundRect(692, 410, 36, 8, 3);
    ctx.fill();

    // Render flying seagulls
    for (const s of this.seagulls) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Flapping wings
      const wingFlap = Math.sin(s.wingPhase) * 8;
      ctx.strokeStyle = '#2f3542';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, -wingFlap);
      ctx.quadraticCurveTo(0, 2, 10, -wingFlap);
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Stage 5: Deep Ocean ---
  renderOceanBackground(ctx, width, height) {
    // Water gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 560);
    oceanGrad.addColorStop(0, '#1e3799');
    oceanGrad.addColorStop(1, '#0a3d62');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, 560);

    // Sunlight caustic rays from surface
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(240, 0);
    ctx.lineTo(360, 560);
    ctx.lineTo(260, 560);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(780, 0);
    ctx.lineTo(860, 0);
    ctx.lineTo(1020, 560);
    ctx.lineTo(920, 560);
    ctx.closePath();
    ctx.fill();

    // Ambient floating water bubbles
    for (const b of this.oceanBubbles) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Little cute tropical fish swimming in background
    const fishOffset = (Date.now() / 25) % (width + 100);
    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.ellipse(fishOffset - 50, 180, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fishOffset - 62, 180);
    ctx.lineTo(fishOffset - 72, 172);
    ctx.lineTo(fishOffset - 72, 188);
    ctx.closePath();
    ctx.fill();
  }

  // --- Stage 6: Sunset Desert ---
  renderDesertBackground(ctx, width, height) {
    // Sky sunset gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 560);
    skyGrad.addColorStop(0, '#e17055');
    skyGrad.addColorStop(0.65, '#fab1a0');
    skyGrad.addColorStop(1, '#ffeaa7');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, 560);

    // Glowing Crimson Setting Sun
    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.arc(640, 360, 95, 0, Math.PI * 2);
    ctx.fill();

    // Ancient Pyramids in distance
    ctx.fillStyle = '#d35400';
    ctx.beginPath();
    ctx.moveTo(180, 560);
    ctx.lineTo(320, 380);
    ctx.lineTo(460, 560);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(380, 560);
    ctx.lineTo(490, 420);
    ctx.lineTo(600, 560);
    ctx.closePath();
    ctx.fill();

    // Rolling sand dunes in midground
    ctx.fillStyle = '#fdcb6e';
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.quadraticCurveTo(320, 480, 680, 560);
    ctx.fill();

    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(580, 560);
    ctx.quadraticCurveTo(940, 470, width, 560);
    ctx.fill();
  }

  // --- Stage 7: Cosmic Galaxy Space ---
  renderSpaceBackground(ctx, width, height) {
    // Deep dark space
    ctx.fillStyle = '#0c0c24';
    ctx.fillRect(0, 0, width, 560);

    // Swirling nebula glow
    const nebulaGrad = ctx.createRadialGradient(400, 200, 20, 400, 200, 320);
    nebulaGrad.addColorStop(0, 'rgba(155, 89, 182, 0.45)');
    nebulaGrad.addColorStop(0.5, 'rgba(52, 152, 219, 0.25)');
    nebulaGrad.addColorStop(1, 'rgba(12, 12, 36, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, width, 560);

    // Distant Beautiful Blue Earth
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(1060, 130, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(1050, 115, 25, 0, Math.PI * 2);
    ctx.arc(1080, 145, 18, 0, Math.PI * 2);
    ctx.fill();

    // Twinkling stars
    for (const s of this.spaceStars) {
      const alpha = 0.35 + Math.sin(s.phase) * 0.55;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting stars
    for (const star of this.shootingStars) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(star.x - star.vx * 0.1, star.y - star.vy * 0.1);
      ctx.lineTo(star.x, star.y);
      ctx.stroke();
    }
  }

  // --- Stage 8: Frozen Arctic Wonderland ---
  renderIceBackground(ctx, width, height) {
    // Twilight winter sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 560);
    skyGrad.addColorStop(0, '#2c3e50');
    skyGrad.addColorStop(1, '#dfe4ea');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, 560);

    // Northern Lights (Aurora Borealis) ribbon
    const auroraOffset = (Date.now() / 800) % (Math.PI * 2);
    ctx.fillStyle = 'rgba(46, 213, 115, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 120);
    for (let x = 0; x <= width; x += 60) {
      const y = 110 + Math.sin(x * 0.006 + auroraOffset) * 45;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Distant snowy mountain peaks
    ctx.fillStyle = '#a4b0be';
    ctx.beginPath();
    ctx.moveTo(60, 560);
    ctx.lineTo(260, 340);
    ctx.lineTo(460, 560);
    ctx.closePath();
    ctx.fill();
    // Snow cap on mountain
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(210, 395);
    ctx.lineTo(260, 340);
    ctx.lineTo(310, 395);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#747d8c';
    ctx.beginPath();
    ctx.moveTo(760, 560);
    ctx.lineTo(960, 310);
    ctx.lineTo(1160, 560);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(900, 375);
    ctx.lineTo(960, 310);
    ctx.lineTo(1020, 375);
    ctx.closePath();
    ctx.fill();

    // Falling gentle snowflakes
    for (const sf of this.snowflakes) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(sf.x, sf.y, sf.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
