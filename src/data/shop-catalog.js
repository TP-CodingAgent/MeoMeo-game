/**
 * Thai Phung: Cute Cat Bubble Shooter - Shop Catalog
 * Definitive catalog of Gun Skins, Muzzle Effects, and Cat Modular Accessories.
 */

export const SHOP_ITEM_TYPES = {
  GUN_SKIN: 'gun_skin',
  GUN_EFFECT: 'gun_effect',
  CAT_ACCESSORY: 'cat_accessory'
};

export const CAT_SLOTS = {
  HEAD: 'head',
  FACE: 'face',
  BACK: 'back',
  AURA: 'aura'
};

// Thai-Phung: Catalog of shop items
export const SHOP_CATALOG = [
  // --- 1. GUN SKINS (1 equipped at a time) ---
  {
    id: 'classic_blaster',
    type: SHOP_ITEM_TYPES.GUN_SKIN,
    name: 'Súng Kẹo Ngọt Cổ Điển',
    desc: 'Khẩu súng phun bọt nước màu hồng pastel dễ thương mặc định.',
    icon: '🔫',
    price: 0,
    isDefault: true
  },
  {
    id: 'cyber_cannon',
    type: SHOP_ITEM_TYPES.GUN_SKIN,
    name: 'Súng Laser Không Gian',
    desc: 'Vỏ hợp kim titan xanh neon, ống năng lượng hologram góc cạnh công nghệ cao.',
    icon: '🚀',
    price: 5000,
    isDefault: false
  },
  {
    id: 'candy_lollipop',
    type: SHOP_ITEM_TYPES.GUN_SKIN,
    name: 'Đại Bác Kẹo Mút Cầu Vồng',
    desc: 'Nòng xoắn kẹo cầu vồng, bình chứa thủy tinh ngọt ngào phủ kẹo cốm.',
    icon: '🍭',
    price: 12000,
    isDefault: false
  },
  {
    id: 'shark_bazooka',
    type: SHOP_ITEM_TYPES.GUN_SKIN,
    name: 'Súng Bazooka Cá Mập',
    desc: 'Tạo hình cá mập xanh dũng mãnh, vây lưng bơi lội và hàm răng cá tính.',
    icon: '🦈',
    price: 25000,
    isDefault: false
  },
  {
    id: 'royal_gold',
    type: SHOP_ITEM_TYPES.GUN_SKIN,
    name: 'Súng Hoàng Kim Vương Giả',
    desc: 'Đúc bằng vàng 24K nguyên khối lấp lánh, đính ngọc hồng lựu quyền quý.',
    icon: '👑',
    price: 50000,
    isDefault: false
  },

  // --- 2. GUN TRAIL & MUZZLE EFFECTS (1 equipped at a time) ---
  {
    id: 'none_effect',
    type: SHOP_ITEM_TYPES.GUN_EFFECT,
    name: 'Bọt Nước Nguyên Bản',
    desc: 'Vệt bắn bọt nước trong suốt truyền thống.',
    icon: '🫧',
    price: 0,
    isDefault: true
  },
  {
    id: 'sparkle_trail',
    type: SHOP_ITEM_TYPES.GUN_EFFECT,
    name: 'Vệt Sao Lấp Lánh',
    desc: 'Mỗi phát bắn tỏa ra chùm bụi sao vàng lấp lánh trên đường bay.',
    icon: '✨',
    price: 3000,
    isDefault: false
  },
  {
    id: 'heart_stream',
    type: SHOP_ITEM_TYPES.GUN_EFFECT,
    name: 'Suối Nguồn Trái Tim',
    desc: 'Các trái tim hồng bay bổng cuộn tròn theo bong bóng nước.',
    icon: '💖',
    price: 8000,
    isDefault: false
  },
  {
    id: 'plasma_bolt',
    type: SHOP_ITEM_TYPES.GUN_EFFECT,
    name: 'Xung Điện Plasma',
    desc: 'Tia chớp xanh dương sinh động phóng theo hướng ngắm bắn.',
    icon: '⚡',
    price: 15000,
    isDefault: false
  },

  // --- 3. CAT ACCESSORIES (1 per slot: HEAD, FACE, BACK, AURA) ---
  // Slot: HEAD
  {
    id: 'top_hat',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.HEAD,
    name: 'Mũ Ảo Thuật Gia',
    desc: 'Chiếc mũ chóp cao màu đen lịch lãm đính ruy băng đỏ quý phái.',
    icon: '🎩',
    price: 4000,
    isDefault: false
  },
  {
    id: 'crown',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.HEAD,
    name: 'Vương Miện Hoàng Gia',
    desc: 'Vương miện vàng đính hồng ngọc dành riêng cho vua loài mèo.',
    icon: '👑',
    price: 10000,
    isDefault: false
  },
  {
    id: 'angel_halo',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.HEAD,
    name: 'Vòng Hào Quang Thiên Thần',
    desc: 'Vòng ánh sáng vàng ấm áp lơ lửng nhẹ nhàng trên đỉnh đầu mèo.',
    icon: '😇',
    price: 18000,
    isDefault: false
  },
  {
    id: 'cute_bow',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.HEAD,
    name: 'Nơ Bướm Hồng Dễ Thương',
    desc: 'Chiếc nơ ruy băng hồng xinh xắn gắn lệch bên tai mèo.',
    icon: '🎀',
    price: 6000,
    isDefault: false
  },

  // Slot: FACE
  {
    id: 'sunglasses',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.FACE,
    name: 'Kính Râm Siêu Ngầu',
    desc: 'Cặp kính đen thời thượng giúp mèo cưng trông như điệp viên bí mật.',
    icon: '🕶️',
    price: 5000,
    isDefault: false
  },
  {
    id: 'round_glasses',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.FACE,
    name: 'Kính Tròn Tri Thức',
    desc: 'Gọng kính tròn thanh mảnh phong cách học giả thông thái.',
    icon: '👓',
    price: 7000,
    isDefault: false
  },
  {
    id: 'mustache',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.FACE,
    name: 'Râu Quý Tộc Uốn Cong',
    desc: 'Hàng ria mép đen uốn cong sang trọng phong cách quý tộc châu Âu.',
    icon: '🥸',
    price: 9000,
    isDefault: false
  },
  {
    id: 'bandage',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.FACE,
    name: 'Băng Dán Má Tinh Nghịch',
    desc: 'Miếng băng cá nhân chữ thập dán bên má tinh nghịch như anime.',
    icon: '🩹',
    price: 3500,
    isDefault: false
  },

  // Slot: BACK
  {
    id: 'superhero_cape',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.BACK,
    name: 'Áo Choàng Siêu Nhân',
    desc: 'Áo choàng đỏ rực phấp phới sau lưng theo từng nhịp nhảy của mèo.',
    icon: '🦸',
    price: 12000,
    isDefault: false
  },
  {
    id: 'mini_backpack',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.BACK,
    name: 'Balo Dã Ngoại Nhỏ Xinh',
    desc: 'Chiếc balo màu vàng cam đựng cá hộp tí hon cho mèo đi phượt.',
    icon: '🎒',
    price: 8000,
    isDefault: false
  },
  {
    id: 'angel_wings',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.BACK,
    name: 'Đôi Cánh Thiên Thần',
    desc: 'Đôi cánh lông vũ trắng tinh khôi vẫy nhẹ nhàng sau lưng chú mèo.',
    icon: '🧚',
    price: 20000,
    isDefault: false
  },

  // Slot: AURA
  {
    id: 'sparkle_aura',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.AURA,
    name: 'Hào Quang Sao Lấp Lánh',
    desc: 'Những ngôi sao nhỏ xíu xoay tròn tỏa sáng nhẹ xung quanh mèo.',
    icon: '✨',
    price: 10000,
    isDefault: false
  },
  {
    id: 'heart_aura',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.AURA,
    name: 'Vòng Xoáy Trái Tim',
    desc: 'Các bóng tim hồng đập nhịp nhàng bay lơ lửng quanh người mèo.',
    icon: '💖',
    price: 15000,
    isDefault: false
  },
  {
    id: 'electric_aura',
    type: SHOP_ITEM_TYPES.CAT_ACCESSORY,
    slot: CAT_SLOTS.AURA,
    name: 'Tia Sét Năng Lượng',
    desc: 'Tia lửa điện màu xanh dương chớp nháy bao bọc chú mèo siêu tốc.',
    icon: '⚡',
    price: 22000,
    isDefault: false
  }
];

export const SHOP_MAP = new Map(SHOP_CATALOG.map(item => [item.id, item]));
