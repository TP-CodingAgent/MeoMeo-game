# Changelog

All notable changes to the **Cute Cat Bubble Shooter (*Bắn Bong Bóng Mèo Cưng*)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-01

### 🐾 Project Information
* **Author:** Thái Phùng (Thai Phung)
* **Location:** Ho Chi Minh City, Vietnam
* **Year:** 2026
* **Harness & Process:** TP AI-SDLC Version 4 Harness (`antigravity`)
* **AI Engine:** Google Gemini 3.8 Flash
* **License:** MIT License
* **Automated Tests:** 36/36 Unit Tests Passed (10 Suites)

---

### 🚀 Added - Initial Release & Core Gameplay
* **First-Person Water Blaster (FPS Mode):**
  * Handcrafted 2D vector water blaster rendered in real-time at the bottom of the screen.
  * Dynamically tracks mouse X coordinate and re-calculates aim angle each frame to eliminate rotational lag.
  * Integrated spring-based recoil physics and transparent fluid chamber reflecting live water levels.
* **Dual Game Modes:**
  * **Relax Mode:** Endless, peaceful gameplay without time limits; free exploration of cat behaviors and collection building.
  * **Challenge Mode:** 60-second high-score time trial with active combo multiplier (up to 5x), real-time countdown timer, and Game Over summary modal.
* **8 Interactive Procedural Stages:**
  * `Phòng Khách Ấm Cúng` (Cozy Living Room): Wall shelves, pendulum cat clock, cushioned sofa, hiding boxes.
  * `Phòng Ngủ Kẹo Ngọt` (Sweet Bedroom): Wardrobe tower, toy shelves, bean bag cushions.
  * `Khu Vườn Nắng Ấm` (Sunny Garden): Apple trees, fluttering birds, fluttering clothesline, garden fence.
  * `Bãi Biển Nhiệt Đới` (Tropical Beach): Slanted coconut palm, beach hammock, umbrella, sandcastle.
  * `Dưới Lòng Đại Dương` (Deep Ocean): Coral shelves, sunken shipwreck deck, bubbling seaweeds, treasure chest.
  * `Sa Mạc Hoàng Hôn` (Sunset Desert): Sun-baked sandstone cliffs, blooming cacti, oasis water pool.
  * `Trạm Vũ Trụ Không Gian` (Space Station): Floating zero-g platforms, meteor showers, solar panels.
  * `Xứ Sở Băng Tuyết` (Frozen Wonderland): Hanging icicle ledges, cozy igloo, crystal ice sculptures, falling snowflakes.
* **12 International Cat Breeds (Cat Encyclopedia):**
  * Fully procedural rendering with unique coats, distinct ear types (`pointed`, `folded`, `lynx_tufted`, `huge_bat`), and body builds (`round_chubby`, `slender`, `giant`, `athletic`).
  * Breeds: Mèo Mướp Vàng (VN 🇻🇳), Mèo Anh Lông Ngắn (GB 🇬🇧), Mèo Tai Cụp Scottish (GB 🇬🇧), Mèo Ba Tư (IR 🇮🇷), Mèo Xiêm (TH 🇹🇭), Mèo Đen Bombay (US 🇺🇸), Mèo Nga Mắt Xanh (RU 🇷🇺), Mèo Tam Thể (JP 🇯🇵), Mèo Rừng Na Uy (NO 🇳🇴), Mèo Khổng Lồ Maine Coon (US 🇺🇸), Mèo Không Lông Sphynx (CA 🇨🇦), Mèo Báo Bengal (US 🇺🇸).
  * Rich Vietnamese encyclopedic descriptions: History, physical appearance, and temperament for all 12 cats.
* **7 Collectible Bubble Shapes:**
  * Unlocked by befriending specific cat breeds: `heart` (Trái tim), `paw` (Bàn chân), `star` (Ngôi sao), `apple` (Quả táo), `cupcake` (Bánh ngọt), `crown` (Vương miện), `diamond` (Kim cương).
* **Dual Audio Pipeline:**
  * Native synthesized Web Audio API synthesizer for instant zero-dependency sound generation.
  * Seamless fallback and support for high-quality audio files (`shoot.wav`, `pop.wav`, `meow.wav`, `unlock.wav`, `reload.wav`, `thump.wav`, `shape_unlock.wav`).
* **Safe Local Storage Adapter:**
  * Encapsulated `safeStorage` wrapper preventing exceptions in privacy/incognito modes.
  * Auto-saves high score, encyclopedia unlocks, discovered bubble shapes, and equipped cosmetics.

---

### 🛍️ Added - Paw Points Currency & Cosmetic Shop System
* **Paw Points (🐾) Economy:**
  * Earned organically through hitting cats, scaling with cat rarity and combo multipliers.
  * Real-time HUD Paw Points chip indicator and persistence in local storage.
* **Blaster Gun Customization (1 Skin & 1 Effect rule):**
  * **5 Unique Gun Skins:**
    * *Classic Blaster (Default)*: Pastel cute water blaster with clear fluid reservoir.
    * *Cyber Cannon*: Futuristic cyan/magenta plasma blaster with digital battery readout.
    * *Candy Lollipop*: Sweet pink swirled lollipop cannon with syrup level chamber.
    * *Shark Bazooka*: Ocean predator themed launcher with shark teeth and fin sighting.
    * *Royal Gold*: Gilded regal blazon adorned with rubies and crystal water urn.
  * **4 Muzzle Effects:**
    * *None Effect*: Standard bubbly muzzle flash.
    * *Sparkle Trail*: Golden shimmering starlight burst on bubble launch.
    * *Heart Stream*: Cascading stream of floating hearts upon firing.
    * *Plasma Bolt*: High-velocity neon cyan energy ring emission.
* **Modular Cat Outfits (Multi-slot simultaneous equipment across distinct categories):**
  * **Head Slot:** Top Hat (Mũ Ảo Thuật), Golden Crown (Vương Miện Hoàng Gia), Angel Halo (Vòng Hào Quang Thiên Thần), Pink Bow (Nơ Hồng Dễ Thương).
  * **Face Slot:** Cool Sunglasses (Kính Mát Sành Điệu), Smart Glasses (Kính Tròn Tri Thức), Gentleman Mustache (Râu Quý Tộc), Cute Bandage (Băng Dán Đáng Yêu).
  * **Back Slot:** Superhero Cape (Áo Choàng Siêu Nhân), Explorer Backpack (Ba Lô Thám Hiểm), Angel Wings (Đôi Cánh Thiên Thần).
  * **Aura Slot:** Sparkle Aura (Hào Quang Lấp Lánh), Floating Hearts Aura (Hào Quang Trái Tim), Neon Magic Rings (Vòng Tròn Phép Thuật).
* **Live Cosmetic Preview:**
  * Interactive dual preview canvas inside the shop allowing instant inspection of gun skins and cat accessories before purchasing.

---

### 🔄 Added - Dynamic Cat Turnover & Guaranteed Discovery Pity System
* **Natural Controlled Cat Turnover:**
  * Cats complete their stay gracefully (~28–48 seconds or after being petted multiple times) and casually walk off-screen (`CAT_STATES.LEAVING`).
  * Strict population guard: At most 1 cat can leave at a time, ensuring a minimum of 3–4 visible cats remain on stage at all times.
* **Natural Newcomer Entrance (`CAT_STATES.ENTERING`):**
  * When a cat departs, a new friend emerges from beyond the left or right screen boundary and thong dong steps into the scene.
  * Completely eliminates empty screens and pop-in visual glitches.
* **10-Minute Guaranteed Discovery Pity System:**
  * **After 10 Minutes (600s):** 100% guaranteed priority to spawn any uncollected breeds (specifically guaranteeing the 5-star `Maine Coon` and `Bengal` cats for complete album discovery).
  * **After 5 Minutes (300s):** Boosts missing breed spawn rate up to 80%.
  * **Bad Luck Protection:** Guaranteed 4-star or 5-star rare cat spawn every 5 consecutive non-rare spawns.
* **5-Star Legendary Sparkle Effect:**
  * Dynamic orbiting golden sparkles rendered around rarity-5 cats to clearly signal their presence to the player.

---

### ⚙️ Added - In-Game Settings Modal & Quick Stage Navigation
* **Configurable Gameplay Parameters:**
  * *Bình Nước (Max Ammo):* Configurable from 1 to 80 shots (default: 20).
  * *Mật Độ Mèo (Min Active Cats):* Configurable from 2 to 10 simultaneous cats (default: 4).
  * *Thời Gian Nạp Nước (Cooldown Duration):* Configurable from 0.0s (instant refill) to 10.0s (default: 2.0s).
* **8-Stage Quick Select Grid:**
  * Interactive stage switcher buttons inside the settings dialog and HUD dropdown menu with quick preview icons.
* **Factory Reset Feature:**
  * Dedicated button to safely erase all high scores, encyclopedia unlocks, and custom settings back to factory default.
* **Input Cursor Decoupling:**
  * Fixed custom mouse cursor mapping when hovering over modal inputs, sliders, and stage selection dropdowns.

---

### 🐾 Added - Author Attribution UI & Home Paw Prints Animation
* **Home Page Attribution Card (Middle Bottom):**
  * Glassmorphism badge: **Tác Giả: Thái Phùng** • **Năm 2026** • **Hồ Chí Minh, Việt Nam**.
  * Floating animation (`homeAuthorFloat`) and pulsating cat paw indicator (`authorPawWiggle`).
* **Home Page Dynamic Cat Paw Tracks Effect:**
  * 3 virtual cats roam the Start Screen in independent wandering paths with pastel coral, amber, and lavender paw colors.
  * **Strict Trail Rule:** Displays a maximum of 4 paw prints per cat. When a new step is taken, the oldest paw print smoothly fades away.
  * Realistic alternating left/right foot offset and direction-aligned toe rotation.
  * **Zero CPU Overhead During Play:** The animation loop is completely halted (`cancelAnimationFrame`) when entering gameplay.
* **Game Screen Author Badge (Bottom Right):**
  * Subtle, elegant author badge in the bottom-right corner: `🐾 Tác giả: Thái Phùng`.
  * Configured with `pointer-events: none` to guarantee smooth, unobstructed mouse crosshair aiming.

---

### 🛠️ Added - One-Click Bootstrap Scripts
* **`run.bat` (Windows):**
  * One-click start: Runs automated unit tests, starts Python HTTP server daemon on port 8088 (with automatic fallback to 8089), and automatically launches the default browser.
  * Keeps the console window open with colored logs.
* **`run.sh` (macOS / Linux / WSL):**
  * Shell script equivalent with automated browser detection (`xdg-open`, `open`, or `start`).

---

### 🧪 Automated Verification & Quality Assurance
* **Test Suite:** 36 automated unit tests across 10 functional suites covering Math, Safe Storage, Catalog Integrity, Cannon Physics, Spawner & Pity Systems, Prop Elasticity, Cat State Machine, Scene Unlocks, Settings, and Shop Inventory.
* **Fail-Safe Game Loop:** Protected `Game.loop` execution via `try/catch/finally` ensuring `requestAnimationFrame` continuously executes under all conditions.
* **TP AI-SDLC Harness Verification:** `tp doctor` (PASS) and `tp verify --strict` (`integrity: ok`, `audit_ok: true`, `state_ok: true`).
