/**
 * International Cat Breed Encyclopedia Catalog
 * TP AIDLC - Cute Cat Color Water Shooter (PDR-006)
 * Includes distinct physical features for procedural visual rendering and bubble shape rewards.
 */

export const BUBBLE_SHAPES = {
  circle: { id: 'circle', name: 'Bọt Tròn Cổ Điển', icon: '🫧', desc: 'Bong bóng tròn óng ánh' },
  heart: { id: 'heart', name: 'Bọt Trái Tim', icon: '💖', desc: 'Bong bóng tình yêu ngọt ngào' },
  star: { id: 'star', name: 'Bọt Ngôi Sao', icon: '⭐', desc: 'Bong bóng ngôi sao lấp lánh' },
  paw: { id: 'paw', name: 'Bọt Bàn Chân', icon: '🐾', desc: 'Bong bóng đệm chân mèo cưng' },
  apple: { id: 'apple', name: 'Bọt Quả Táo', icon: '🍎', desc: 'Bong bóng táo giòn mọng nước' },
  cupcake: { id: 'cupcake', name: 'Bọt Bánh Ngọt', icon: '🧁', desc: 'Bong bóng kem bơ xốp mềm' },
  crown: { id: 'crown', name: 'Bọt Vương Miện', icon: '👑', desc: 'Bong bóng hoàng gia quý tộc' },
  diamond: { id: 'diamond', name: 'Bọt Kim Cương', icon: '💎', desc: 'Bong bóng ngọc quý lấp lánh' }
};

// Thai Phung: Catalog of cat breeds
export const CAT_BREEDS = [
  {
    id: 'vietnamese_tabby',
    name: 'Mèo Mướp Vàng',
    englishName: 'Vietnamese Tabby',
    country: 'Việt Nam',
    countryFlag: '🇻🇳',
    rarity: 1,
    breedType: 'tabby',
    earType: 'normal',
    bodyType: 'lean',
    palette: {
      body: '#FFA726',
      stripes: '#E65100',
      belly: '#FFE0B2',
      eyes: '#76FF03'
    },
    shapeReward: 'paw',
    description: {
      history: 'Giống mèo bản địa thân thuộc của làng quê Việt Nam từ hàng nghìn năm trước, gắn liền với hình ảnh chú mèo bắt chuột cần cù và ấm áp bên bếp lửa.',
      appearance: 'Lông ngắn sọc vằn cam vàng như hổ con, thân hình săn chắc, đôi mắt tròn xoe màu xanh ngọc bích lanh lợi.',
      temperament: 'Cực kỳ thông minh, nhanh nhẹn, thích bắt chuột, trung thành và thích được vuốt ve xoa cằm.'
    },
    soundCue: 'meow_tabby'
  },
  {
    id: 'british_shorthair',
    name: 'Mèo Anh Lông Ngắn',
    englishName: 'British Shorthair',
    country: 'Vương Quốc Anh',
    countryFlag: '🇬🇧',
    rarity: 2,
    breedType: 'british',
    earType: 'normal',
    bodyType: 'round_chubby',
    palette: {
      body: '#78909C',
      stripes: '#546E7A',
      belly: '#B0BEC5',
      eyes: '#FFB300'
    },
    shapeReward: 'paw',
    description: {
      history: 'Là một trong những giống mèo lâu đời nhất tại Anh, hậu duệ của những chú mèo được quân viễn chinh La Mã cổ đại đưa đến hòn đảo Anh quốc.',
      appearance: 'Mặt tròn bánh bao núng nính, thân hình mũm mĩm chắc nịch, bộ lông xám xanh dày mịn như nhung và đôi mắt màu hổ phách tuyệt đẹp.',
      temperament: 'Điềm tĩnh, hiền lành, yêu kiều như quý tộc Anh, thích nằm êm bên cửa sổ và rất thích chơi với trẻ em.'
    },
    soundCue: 'meow_british'
  },
  {
    id: 'scottish_fold',
    name: 'Mèo Tai Cụp Scottish',
    englishName: 'Scottish Fold',
    country: 'Scotland',
    countryFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    rarity: 2,
    breedType: 'scottish',
    earType: 'folded',
    bodyType: 'round_chubby',
    palette: {
      body: '#FFE0B2',
      stripes: '#FFB74D',
      belly: '#FFF8E1',
      eyes: '#FF9800'
    },
    shapeReward: 'heart',
    description: {
      history: 'Bắt nguồn từ cô mèo nông trại tên Susie tại vùng Perthshire, Scotland năm 1961 có đột biến tự nhiên khiến vành tai gập về phía trước như cú con.',
      appearance: 'Đôi tai gập sát đầu tạo khuôn mặt tròn xoe như quả bóng, đôi mắt to ngơ ngác cực kỳ dễ thương.',
      temperament: 'Ngọt ngào, hiền khô, thích ngồi dáng "Phật ngồi" ngộ nghĩnh và quấn chủ như một người bạn tri kỷ.'
    },
    soundCue: 'meow_scottish'
  },
  {
    id: 'persian',
    name: 'Mèo Ba Tư Lông Dài',
    englishName: 'Persian Cat',
    country: 'Iran',
    countryFlag: '🇮🇷',
    rarity: 3,
    breedType: 'persian',
    earType: 'normal',
    bodyType: 'extra_fluffy',
    palette: {
      body: '#ECEFF1',
      stripes: '#CFD8DC',
      belly: '#FFFFFF',
      eyes: '#29B6F6'
    },
    shapeReward: 'heart',
    description: {
      history: 'Từng là thú cưng vương giả trong các cung điện hoàng gia Ba Tư cổ đại, được du khách mang sang châu Âu vào thế kỷ 17 và trở thành biểu tượng quý phái.',
      appearance: 'Bộ lông kép dài tha thướt bồng bềnh như mây tuyết, khuôn mặt tịt tròn trĩnh đặc trưng và chiếc mũi nhỏ xíu kiêu sa.',
      temperament: 'Điềm đạm, ít khi kêu to, thích nằm yên vị trên thảm êm hoặc đệm nhung được vuốt ve bộ lông kiều diễm.'
    },
    soundCue: 'meow_persian'
  },
  {
    id: 'siamese',
    name: 'Mèo Xiêm Quý Phái',
    englishName: 'Siamese Cat',
    country: 'Thái Lan',
    countryFlag: '🇹🇭',
    rarity: 3,
    breedType: 'siamese',
    earType: 'pointed',
    bodyType: 'slender',
    palette: {
      body: '#F5EBE6',
      stripes: '#4A3525', // mask and points
      belly: '#FAF4F0',
      eyes: '#0288D1'
    },
    shapeReward: 'cupcake',
    description: {
      history: 'Từng là báu vật linh thiêng trong các đền đài và hoàng gia Vương quốc Xiêm (Thái Lan), được tin là linh thú canh giữ kho báu tâm linh.',
      appearance: 'Thân hình mảnh mai thanh thoát, đôi mắt xanh ngọc bích sâu thẳm, mặt nạ đen tuyền cùng 4 chân và tai màu chocolate tương phản quyến rũ.',
      temperament: 'Cực kỳ thông minh, giao tiếp nhiều bằng những tiếng "meo meo" trầm ấm, thích quấn quýt và hay tò mò học trò mới.'
    },
    soundCue: 'meow_siamese'
  },
  {
    id: 'bombay',
    name: 'Mèo Đen Bombay',
    englishName: 'Bombay Cat',
    country: 'Hoa Kỳ',
    countryFlag: '🇺🇸',
    rarity: 3,
    breedType: 'bombay',
    earType: 'normal',
    bodyType: 'sleek',
    palette: {
      body: '#263238',
      stripes: '#1A237E',
      belly: '#37474F',
      eyes: '#FFD600'
    },
    shapeReward: 'star',
    description: {
      history: 'Được nhà gây giống Nikki Horner tạo ra năm 1958 tại Louisville, Kentucky với mong muốn tạo nên một chú "báo đen mini" hiền lành trong phòng khách.',
      appearance: 'Bộ lông màu đen tuyền óng ánh như da thuộc bóng láng, đôi mắt to tròn màu đồng ánh vàng lấp lánh như hai vầng trăng nhỏ.',
      temperament: 'Tràn đầy tình cảm, thân thiện bất ngờ, thích nhảy vào lòng người chơi để sưởi ấm và hòa đồng với mọi loài vật khác.'
    },
    soundCue: 'meow_bombay'
  },
  {
    id: 'russian_blue',
    name: 'Mèo Nga Mắt Xanh',
    englishName: 'Russian Blue',
    country: 'Nga',
    countryFlag: '🇷🇺',
    rarity: 4,
    breedType: 'russian_blue',
    earType: 'pointed',
    bodyType: 'graceful',
    palette: {
      body: '#607D8B',
      stripes: '#455A64',
      belly: '#90A4AE',
      eyes: '#00E676'
    },
    shapeReward: 'star',
    description: {
      history: 'Bắt nguồn từ cảng Arkhangelsk trên bờ Biển Trắng nước Nga, từng là linh miêu được các Sa hoàng Nga hết mực nâng niu trong cung điện Mùa Đông.',
      appearance: 'Bộ lông ngắn dày hai lớp màu xám xanh ánh bạc lấp lánh độc nhất vô nhị, nụ cười Mona Lisa khẽ nhếch và đôi mắt xanh lục bảo mê hoặc.',
      temperament: 'Kín đáo, dịu dàng, cực kỳ trung thành với người mình yêu mến, phản xạ nhảy nhót nhẹ nhàng không tạo tiếng động.'
    },
    soundCue: 'meow_russian'
  },
  {
    id: 'calico',
    name: 'Mèo Tam Thể May Mắn',
    englishName: 'Calico Cat (Mi-Ke)',
    country: 'Nhật Bản',
    countryFlag: '🇯🇵',
    rarity: 4,
    breedType: 'calico',
    earType: 'normal',
    bodyType: 'round_chubby',
    palette: {
      body: '#FFFFFF',
      stripes: '#FF6F00', // orange & black patches
      belly: '#212121',
      eyes: '#FFB300'
    },
    shapeReward: 'apple',
    description: {
      history: 'Là biểu tượng chú mèo vẫy tay may mắn Maneki-neko nổi tiếng khắp đất nước Mặt Trời Mọc, tượng trưng cho tài lộc, bình an và hạnh phúc gia đình.',
      appearance: 'Sự kết hợp hoàn hảo giữa ba mảng màu trắng tuyết, cam rực rỡ và đốm đen huyền bí rải đều khắp cơ thể ngộ nghĩnh.',
      temperament: 'Cá tính mạnh mẽ, tinh nghịch, lém lỉnh, đôi lúc đỏng đảnh dễ thương nhưng rất gắn bó và đem lại nhiều niềm vui cho mọi người.'
    },
    soundCue: 'meow_calico'
  },
  {
    id: 'norwegian_forest',
    name: 'Mèo Rừng Na Uy',
    englishName: 'Norwegian Forest Cat',
    country: 'Na Uy',
    countryFlag: '🇳🇴',
    rarity: 4,
    breedType: 'norwegian',
    earType: 'lynx_tufted',
    bodyType: 'extra_fluffy',
    palette: {
      body: '#8D6E63',
      stripes: '#4E342E',
      belly: '#D7CCC8',
      eyes: '#76FF03'
    },
    shapeReward: 'crown',
    description: {
      history: 'Loài mèo cổ xưa xuất hiện trong các câu chuyện thần thoại Bắc Âu cổ, là bạn đồng hành cùng các chiến binh Viking vượt biển băng giá.',
      appearance: 'Bờm cổ xù bông như sư tử con, móng vuốt siêu khỏe có khả năng leo trèo thoăn thoắt trên những vách đá và thân cây cao chót vót.',
      temperament: 'Dũng cảm, thích khám phá độ cao, bản tính độc lập nhưng tràn đầy lòng yêu thương đối với gia đình.'
    },
    soundCue: 'meow_norwegian'
  },
  {
    id: 'maine_coon',
    name: 'Mèo Khổng Lồ Maine Coon',
    englishName: 'Maine Coon',
    country: 'Hoa Kỳ',
    countryFlag: '🇺🇸',
    rarity: 5,
    breedType: 'maine_coon',
    earType: 'lynx_tufted',
    bodyType: 'giant',
    palette: {
      body: '#A1887F',
      stripes: '#3E2723',
      belly: '#EFEBE9',
      eyes: '#FFC107'
    },
    shapeReward: 'crown',
    description: {
      history: 'Được mệnh danh là "Người khổng lồ dịu dàng" của bang Maine nước Mỹ, loài mèo nhà thuần chủng có kích thước lớn nhất thế giới.',
      appearance: 'Chiều dài có thể đạt hơn 1 mét, cơ bắp cuồn cuộn, đuôi xù dài như đuôi chồn, chỏm lông vuốt nhọn ở chóp tai oai vệ.',
      temperament: 'Hiền lành như cún con, thích rủ rỉ trò chuyện, cực kỳ thân thiện và kiên nhẫn vô tận với trẻ nhỏ.'
    },
    soundCue: 'meow_mainecoon'
  },
  {
    id: 'sphynx',
    name: 'Mèo Không Lông Sphynx',
    englishName: 'Sphynx Cat',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rarity: 5,
    breedType: 'sphynx',
    earType: 'huge_bat',
    bodyType: 'slender',
    palette: {
      body: '#FFCCBC',
      stripes: '#D7CCC8',
      belly: '#FBE9E7',
      eyes: '#40C4FF'
    },
    shapeReward: 'diamond',
    description: {
      history: 'Xuất hiện lần đầu tại Toronto, Canada vào năm 1966 do đột biến gen tự nhiên, đặt theo tên tượng Nhân Sư Ai Cập vì vẻ ngoài huyền bí.',
      appearance: 'Toàn thân không có lông, làn da ấm áp nhăn nheo mềm như da đào, đôi tai to bản như tai dơi và đôi mắt hình quả chanh to tròn.',
      temperament: 'Siêu quấn quýt, thích rúc vào chăn ấm hoặc lòng bàn tay người chơi, tính cách nồng nhiệt và hài hước.'
    },
    soundCue: 'meow_sphynx'
  },
  {
    id: 'bengal',
    name: 'Mèo Báo Bengal',
    englishName: 'Bengal Cat',
    country: 'Hoa Kỳ',
    countryFlag: '🇺🇸',
    rarity: 5,
    breedType: 'bengal',
    earType: 'pointed',
    bodyType: 'athletic',
    palette: {
      body: '#FFB74D',
      stripes: '#5D4037',
      belly: '#FFE082',
      eyes: '#00E676'
    },
    shapeReward: 'diamond',
    description: {
      history: 'Được lai tạo tại Mỹ giữa mèo nhà và mèo báo rừng châu Á (Asian Leopard Cat) nhằm tạo nên một chú báo hoa mai thu nhỏ hiền lành trong phòng khách.',
      appearance: 'Bộ lông hoa mai đốm tròn (rosette) hoang dã tuyệt mỹ ánh lên sắc vàng kim, bước đi dũng mãnh và đôi mắt phát sáng rực rỡ.',
      temperament: 'Rất dồi dào năng lượng, phản xạ tia chớp, thích nhảy cao vút và thích nghịch nước như một chú báo con.'
    },
    soundCue: 'meow_bengal'
  }
];

export const CAT_CATALOG = CAT_BREEDS.map(cat => ({
  ...cat,
  flag: cat.countryFlag,
  origin: cat.country,
  primaryColor: cat.palette.body,
  secondaryColor: cat.palette.belly,
  stripesColor: cat.palette.stripes,
  eyeColor: cat.palette.eyes,
  history: cat.description.history,
  features: cat.description.appearance,
  temperament: cat.description.temperament
}));

export function getBreedById(id) {
  return CAT_CATALOG.find(b => b.id === id);
}

export function getAllBreeds() {
  return CAT_CATALOG;
}
