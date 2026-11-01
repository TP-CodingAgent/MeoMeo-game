# 🫧 Cute Cat Bubble Shooter — *Bắn Bong Bóng Mèo Cưng*

> A first-person (FPS-style) water-bubble shooter for all ages, running 100% in the browser with
> HTML5 Canvas + vanilla JavaScript (ES6+). **No build step, no npm install, no backend.**

<div align="center">

| | |
|:---|:---|
| **🐾 Author** | **Thai Phung (Thái Phùng)** |
| **📍 Location** | **Ho Chi Minh City, Vietnam** |
| **✨ Year** | **2026** |
| **🛠️ Development process** | **TP AI-SDLC version 4** |
| **🤖 AI model used** | **Gemini 3.8 Flash** |
| **📄 License** | MIT |
| **🧪 Automated tests** | 36 unit tests in 10 suites — all PASS |

</div>

---

## 1. Overview

The player holds a **candy-colored water blaster** rendered at the bottom of the screen in first-person view.
The goal is to shoot soap bubbles — a single chosen pastel color, or **7 cycling rainbow colors** — at
**international cat breeds that play, climb, perch and hide** across eight stages: a living room, a pastel
bedroom, a sunny garden, a tropical beach, the deep ocean, a sunset desert, a space station and a frozen
arctic wonderland.

Every hit:

* Splashes a **color tint over the cat's whole body**; the cat cheers ("meow"), hops and emits hearts and stars.
* Awards **score** scaled by the cat's rarity and by an active **combo multiplier**.
* Grants **Paw Points (🐾)** — the in-game currency for gun skins, muzzle effects and cat fashion.
* **Unlocks the breed** in the Cat Encyclopedia and may unlock a **new bubble shape** (heart, star, paw,
  apple, cupcake, crown, diamond).

The game is intentionally non-violent: no damage, no fail state. Cats just get wet, celebrate, and eventually
wander off stage on their own.

### Highlights

| Area | What the game delivers |
|:---|:---|
| 🎮 Game modes | **Relax** (endless) and **Challenge** (60-second high-score race) |
| 🗺️ Stages | 8 fully procedural Canvas 2D scenes with flying birds, waves, fish, meteors and falling snow |
| 🐱 Encyclopedia | **12 cat breeds** from 10 countries, 1–5 ⭐ rarity, each with Vietnamese history / appearance / temperament entries |
| 🔫 FPS blaster | The gun glides along the bottom axis, re-derives its aim angle every frame (no rotational lag), has recoil and a transparent water tank showing the live fluid level |
| 💧 Water tank | Capacity 1–80 shots (default 20), automatic refill cooldown 0–10 s (default 2.0 s) |
| 🫧 Bubble physics | Fake 3D perspective (bubbles shrink as they recede), ceiling bounce then a 20–30% screen-height drop before popping, side-wall restitution |
| 🛍️ Shop | 23 cosmetics: 5 gun skins, 4 muzzle effects, 14 cat accessories across 4 slots (head / face / back / aura) |
| 🔊 Audio | Dual pipeline: `sounds/*.wav` with seamless Web Audio API synthesizer fallback |
| 💾 Persistence | `localStorage` behind a safe-storage adapter with in-memory fallback (private mode still works) |
| 📈 Performance | 60 FPS target, object pools for bubbles and particles, dirty-checked HUD updates |

---

## 2. Running the game

The game is a static site, but it **must be served over HTTP** because it uses ES Modules and loads audio
assets. Opening `index.html` via `file://` will be blocked by browser CORS rules.

### Windows

```bat
run.bat
```

The script runs the unit test suite when Node.js is available, starts an HTTP server on port `8088`
(automatically switching to `8089` if the port is busy), and opens `http://127.0.0.1:8088/index.html`.

### macOS / Linux / Git Bash

```bash
./run.sh
```

Same behavior: test run (if Node.js exists) → `http.server` on `8088`/`8089` → auto-open browser.

### Manual

```bash
python3 -m http.server 8088 --bind 127.0.0.1
# game:        http://127.0.0.1:8088/index.html
# test runner: http://127.0.0.1:8088/test-runner.html
```

### Requirements

* A modern browser: Chrome, Edge, Firefox or Safari with ES2020, Canvas 2D and `AudioContext` support.
* No Node.js needed to play — only for the CLI test runner.
* Mouse, keyboard and touch are fully equivalent.

---

## 3. Controls

| Action | Mouse / Touch | Keyboard |
|:---|:---|:---|
| Aim | Move the pointer over the canvas (the crosshair follows) | — |
| Fire one shot | Click / tap on the canvas | `Space` |
| Pick bubble color | 6 chips: 5 pastel colors + 🌈 rainbow | — |
| Pick bubble shape | Shape chip row (🔒 until unlocked) | — |
| Pause / resume | `⏸️` HUD button (icon becomes `▶️`) | — |
| Mute / unmute | `🔊` / `🔇` HUD button | — |
| Change stage | HUD stage dropdown, or the 8-stage grid inside Settings | — |
| Collection / Shop / Settings | `📖 Bộ Sưu Tập`, `🛍️ Cửa Hàng`, `⚙️ Cài Đặt` | — |

The fire rate is capped by a `0.08 s` minimum interval between shots (~12.5 shots/second), so button
mashing cannot exceed that ceiling. There is no automatic continuous fire: one input = one bubble.

---

## 4. Game modes

| | 🌈 Relax (`RELAX`) | ⏱️ Challenge (`CHALLENGE`) |
|:---|:---|:---|
| Time limit | None | 60 seconds |
| HUD clock | Hidden | Visible countdown |
| End condition | Play until you pause or return to the menu | Summary modal when the clock hits 0 |
| High score | Not stored | Stored in `cat_shooter_high_score` |
| Best for | Young children, completing the 12-cat album | Score chasing, fast Paw Point farming |

The challenge summary shows final score, personal best, number of cats hit, and collection progress
`x/12 (y%)`, with **Play Again** / **Back to Menu** buttons.

---

## 5. Mechanics in detail

### 5.1 First-person blaster (`src/systems/cannon.js`)

* The gun **slides horizontally** toward the pointer: `targetGunX = clamp(aimX, 180, width - 180)`,
  smoothed with `lerp(current, target, dt * 14)`.
* After sliding, the **aim angle is recomputed** with `atan2` from muzzle to pointer each frame, which
  removes the rotational lag a fixed pivot would produce.
* Each shot applies `recoilOffset = 18 px`, decaying at 60 px/s.
* Bubbles leave the muzzle (barrel length 110 px) at **860 px/s** with base radius **20 px**.
* Five procedurally drawn skins (`classic_blaster`, `cyber_cannon`, `candy_lollipop`, `shark_bazooka`,
  `royal_gold`), each with its own **transparent tank whose fluid height reflects remaining ammo**,
  plus a pressure gauge, digital percentage readout or gem detail.
* The crosshair is a white ring, four ticks colored with the active bubble color, and a glowing center dot.

### 5.2 Water tank and reload (PDR-003)

* Default capacity **20 shots**, configurable from **1 to 80** in Settings.
* Emptying the tank triggers a reload state, default **2.0 s** (configurable **0–10 s**; `0` = instant refill).
* During reload the muzzle and fluid turn gray and the HUD shows a red "refilling (x.x s)…" bar.
* A completed refill plays the `reload` sound.

### 5.3 Bubble physics and shapes (`src/entities/bubble.js`)

* **Simulated depth**: bubbles scale from `1.25` down to `0.85` based on travelled distance relative to the
  aim point, so shots appear to move away in 3D.
* **Ceiling rebound**: touching the top edge (`y - r <= 6`) flips the bubble downward with light gravity
  (`180 px/s²`) and it drops another **20–30% of screen height** before bursting.
* **Side walls** bounce with restitution `0.7`; bubbles also burst after a `3.5 s` lifetime or when falling
  below the screen.
* A sinusoidal wobble stretches the bubble `±8%` with a random phase.
* **8 shapes** drawn as Canvas paths: `circle`, `heart`, `star`, `paw`, `apple`, `cupcake`, `crown`, `diamond`,
  each filled with a radial "wet gloss" gradient plus a white highlight.
* **Rainbow mode**: picking 🌈 cycles 7 `RAINBOW_COLORS` one hue per shot; the other 5 chips are fixed
  `STANDARD_COLORS`.

### 5.4 Cats, rarity and the pity system (`src/systems/spawner.js`)

Breeds are rolled with weighted rarity (tuned to be far more generous than the first iteration):

| Tier | Probability | Breeds |
|:---|:---|:---|
| ⭐ + ⭐⭐ | 40% | Vietnamese Tabby, British Shorthair, Scottish Fold |
| ⭐⭐⭐ | 25% | Persian, Siamese, Bombay |
| ⭐⭐⭐⭐ | 20% | Russian Blue, Calico, Norwegian Forest |
| ⭐⭐⭐⭐⭐ | 15% | Maine Coon, Sphynx, Bengal |

Two fairness layers guarantee progress:

* **Bad-luck protection**: after **5** consecutive spawns with no 4–5★ cat, the next spawn is forced to be
  rare (preferring a missing 5★ breed, then a missing 4★ breed).
* **Discovery pity**: after **5 minutes** of active play, 80% of spawns (or at least every 2nd spawn) deliver a
  breed **missing from the album**; after **10 minutes** the next spawn is **100% guaranteed** to be a missing
  breed until the album is complete. The session play timer is intentionally **preserved across stage changes**.

Population management:

* **Minimum cats on screen**: default 4 (configurable 2–10); maximum = `min + 2`, never below 6.
* A new cat may spawn at most once every `2.4 s`; replenishment cats normally **walk in from the screen edge**
  (`ENTERING`) instead of popping into existence.
* Every cat has a **lifetime of 28–48 s**, then gracefully **walks off-screen** (`LEAVING`). Strict turnover
  rules: only **one cat may be leaving at a time**, and the stage is **never emptied**.
* A cat that has been hit 3+ times and has been on stage over 18 s has its remaining stay shortened by design.

### 5.5 Cat behavior state machine (`src/entities/cat.js`)

Ten states: `IDLE`, `WALKING`, `HIDING`, `PEEKING`, `SURPRISED`, `RUNNING`, `CELEBRATING`, `LEAPING`,
`LEAVING`, `ENTERING`.

* **Accelerated movement**: velocity is lerped with `accel = 6.0`; top speed is
  `70 + (rarity - 1) * 24 + random(0..25) px/s`, so rarer cats are harder to hit, and a running cat moves
  `1.85×` faster.
* **Parabolic leaps** between floor and shelves: `leapTo()` traces a sine arc up to 120 px high over
  0.7–0.85 s, and squash-and-stretch makes the cat compress on landing.
* **Hiding behind props** via `hideBehind(prop)`; while peeking is below `0.35` the cat is **not hittable**.
  In `PEEKING` the cat pops its head out, then may duck back in.
* **Startled (SURPRISED)**: when a prop with a hidden cat is hit, the cat stretches, hops 26 px and bolts away
  (`RUNNING`) in the direction opposite to the impact.
* **Breed-specific drawing**: body types (`lean`, `round_chubby`, `extra_fluffy`, `slender`, `sleek`,
  `graceful`, `giant`, `athletic`), ear types (`normal`, `folded`, `pointed`, `lynx_tufted`, `huge_bat`) and
  per-breed palettes; 5★ cats orbit **three golden sparkles** so players instantly recognize a legendary spawn.
* **Color transformation on hit (PDR-001)**: the bubble's color becomes a body overlay plus a colored outline,
  and the burst emits 3 hearts and 10 star particles.

### 5.6 Interactive props (PDR-004, `src/entities/prop.js`)

* **35 prop archetypes** (41 instances placed across the 8 stages) drawn by hand: sofa, cardboard box, potted
  plant, wall shelf, wardrobe, apple branch, clothesline, fence, beach umbrella, sandcastle, seaweed, treasure
  chest, cactus, nomad tent, mini UFO, lunar rover, snowman, igloo, pine tree and more.
* When hit, a prop **wobbles elastically** via spring integration (stiffness 220–260, damping 16–20) on both
  position and rotation, keeps up to **8 fading paint splats** (5 s lifetime), and plays the `thump` sound.
* Props flagged `isPlatform` form the **elevated tier** where cats can perch and walk.

### 5.7 Collision and depth filtering

Per-frame resolution order: **cats → flying birds → props**.

* Cats and birds: circle–circle test (`isCircleCollidingCircle`).
* Props: circle–AABB test (`isCircleCollidingAABB`).
* **Smart elevation rule**: if a prop is low (`prop.y > 450`) while the player aims high (`targetY < 420`), the
  bubble is treated as **flying over** the low prop and is not blocked — this is what makes shelf cats reachable.
* Hitting a **bird** in the Garden stage: it chirps (meow cue for comedy), swoops 40 px up and accelerates 1.8×.

### 5.8 Scoring, combo and currency

```
score_per_hit       = 100 × rarity(stars) × comboMultiplier
comboMultiplier     = min(consecutive hits, 5)
combo window        = 3.2 s (expires → combo resets to 0)
Paw Points 🐾        = exactly the points just earned, added to the wallet balance
```

Score is shown in the top-left HUD; the wallet appears on the `🛍️ Shop` button and inside the shop. Fast,
rhythmic chains on 5★ cats maximize both score and currency.

### 5.9 Unlockables

| Type | How it unlocks |
|:---|:---|
| Cat breeds (12) | Hit that cat at least once → it appears in the Encyclopedia with its badge |
| Bubble shapes (8) | Each breed has a `shapeReward`: Tabby/British→🐾, Fold/Persian→💖, Siamese→🧁, Bombay/Russian→⭐, Calico→🍎, Norwegian/Maine Coon→👑, Sphynx/Bengal→💎 |
| Gun skins & accessories | Purchased with Paw Points in the shop (purchase auto-equips) |

Each unlock raises a **toast banner** at the top center ("🎉 New collection: 🇻🇳 Vietnamese Tabby!",
"✨ New bubble shape unlocked: 💖 …") with a fanfare cue, and the shape selector re-renders immediately.

---

## 6. The eight stages

| # | Icon | Stage (in-game name) | Scenery highlights | Elevated platforms |
|:--:|:--:|:---|:---|:---|
| 1 | 🏡 | Phòng Khách Ấm Cúng (Cozy Living Room) | Cat pendulum clock swinging, window, floor rug | 2 wall shelves |
| 2 | 🍬 | Phòng Ngủ Kẹo Ngọt (Candy Bedroom) | String of star lights, night window, pink lounger | Tall wardrobe, toy shelf |
| 3 | 🌳 | Khu Vườn Nắng Ấm (Sunny Garden) | Two tall trees, rolling hills, clouds, **shootable birds** | Apple branch, canopy, clothesline |
| 4 | 🏖️ | Bãi Biển Nhiệt Đới (Tropical Beach) | Smiling sun, sailboat, animated wave line, **seagulls** | Leaning palm, hammock |
| 5 | 🌊 | Dưới Lòng Đại Dương (Deep Ocean) | Water gradient, light caustics, **rising bubbles + swimming fish** | Coral rock, sunken ship deck |
| 6 | 🏜️ | Sa Mạc Hoàng Hôn (Sunset Desert) | Crimson sun, **ancient pyramids**, dunes | Magic flying carpet, desert arch |
| 7 | 🚀 | Trạm Vũ Trụ Không Gian (Space Station) | Nebula glow, distant Earth, **45 twinkling stars + meteors** | Steel deck, orbiting satellite |
| 8 | ❄️ | Xứ Sở Băng Tuyết (Frozen Wonderland) | Aurora ribbon, snow peaks, **40 falling snowflakes** | Crystal ice bridge, snow pinnacle |

Switching stages (HUD dropdown or the Settings grid) reloads the scene, respawns cats to satisfy the
configured minimum, and **keeps** collection progress and pity counters.

---

## 7. International Cat Encyclopedia (PDR-006)

Twelve breeds, each with **history, appearance and temperament** written in Vietnamese, plus a dedicated bubble
shape reward. Open it with the `📖 Bộ Sưu Tập` button — or directly from the title screen. Locked cats render as
silhouettes with a 🔒; unlocked cats open a detail dialog with star rating, origin flag and reward badge.

| Breed (id) | Vietnamese name | English name | Country | Rarity | Reward |
|:---|:---|:---|:---|:--:|:--:|
| `vietnamese_tabby` | Mèo Mướp Vàng | Vietnamese Tabby | 🇻🇳 Vietnam | ⭐ | 🐾 |
| `british_shorthair` | Mèo Anh Lông Ngắn | British Shorthair | 🇬🇧 UK | ⭐⭐ | 🐾 |
| `scottish_fold` | Mèo Tai Cụp Scottish | Scottish Fold | 🏴 Scotland | ⭐⭐ | 💖 |
| `persian` | Mèo Ba Tư Lông Dài | Persian Cat | 🇮🇷 Iran | ⭐⭐⭐ | 💖 |
| `siamese` | Mèo Xiêm Quý Phái | Siamese Cat | 🇹🇭 Thailand | ⭐⭐⭐ | 🧁 |
| `bombay` | Mèo Đen Bombay | Bombay Cat | 🇺🇸 USA | ⭐⭐⭐ | ⭐ |
| `russian_blue` | Mèo Nga Mắt Xanh | Russian Blue | 🇷🇺 Russia | ⭐⭐⭐⭐ | ⭐ |
| `calico` | Mèo Tam Thể May Mắn | Calico (Mi-Ke) | 🇯🇵 Japan | ⭐⭐⭐⭐ | 🍎 |
| `norwegian_forest` | Mèo Rừng Na Uy | Norwegian Forest Cat | 🇳🇴 Norway | ⭐⭐⭐⭐ | 👑 |
| `maine_coon` | Mèo Khổng Lồ Maine Coon | Maine Coon | 🇺🇸 USA | ⭐⭐⭐⭐⭐ | 👑 |
| `sphynx` | Mèo Không Lông Sphynx | Sphynx Cat | 🇨🇦 Canada | ⭐⭐⭐⭐⭐ | 💎 |
| `bengal` | Mèo Báo Bengal | Bengal Cat | 🇺🇸 USA | ⭐⭐⭐⭐⭐ | 💎 |

Beyond gameplay, the album doubles as **real breed knowledge** — suitable for children learning about animals
and world cultures.

---

## 8. Shop and customization (`src/systems/shop-manager.js`)

A single currency, **Paw Points 🐾**, earned from scoring. The catalog (`src/data/shop-catalog.js`) holds
**23 items**.

### Gun skins (one equipped at a time)

| Item | Price 🐾 | Description |
|:---|--:|:---|
| 🔫 Classic Candy Blaster (Súng Kẹo Ngọt Cổ Điển) | Free (default) | Pastel pink water gun |
| 🚀 Space Laser Cannon (Súng Laser Không Gian) | 5,000 | Neon titanium alloy, holographic plasma chamber |
| 🍭 Rainbow Lollipop Cannon (Đại Bác Kẹo Mút) | 12,000 | Swirled candy barrel, glass syrup tank with sprinkles |
| 🦈 Shark Bazooka (Súng Bazooka Cá Mập) | 25,000 | Blue shark body, dorsal fin, toothed muzzle |
| 👑 Royal Gold Blaster (Súng Hoàng Kim) | 50,000 | Solid 24K gold look, ruby gem, crown-shaped nozzle |

### Muzzle / trail effects (one equipped at a time)

| Item | Price 🐾 | Particle effect per shot |
|:---|--:|:---|
| 🫧 Plain Water Bubbles | Free | Standard droplets |
| ✨ Sparkle Trail | 3,000 | 6 golden stars |
| 💖 Heart Stream | 8,000 | Floating pink hearts |
| ⚡ Plasma Bolt | 15,000 | 8 cyan energy droplets |

### Cat accessories — 4 slots, one item each, all equipped simultaneously

| Slot | Items (price 🐾) |
|:---|:---|
| 🎩 Head | Magician Top Hat (4,000) · Royal Crown (10,000) · Pink Bow (6,000) · Angel Halo (18,000) |
| 🕶️ Face | Cheek Bandage (3,500) · Sunglasses (5,000) · Round Glasses (7,000) · Aristocrat Mustache (9,000) |
| 🦸 Back | Mini Backpack (8,000) · Superhero Cape (12,000) · Angel Wings (20,000) |
| ✨ Aura | Sparkle Aura (10,000) · Heart Vortex (15,000) · Electric Aura (22,000) |

The shop has **Guns / Cats** tabs plus per-slot sub-filters, and a **live preview canvas** that renders the
equipped blaster and cat using the game's own drawing code (no static images).

---

## 9. Audio (PDR-005, ADR-002)

**Dual pipeline** architecture:

1. Prefer real audio files: `sounds/<key>.wav`, preloaded and validated with `canplaythrough`.
2. If a file fails or is blocked (CORS, missing asset, autoplay policy) → **fall back automatically** to
   `Synthesizer`, which builds the effect from oscillators and envelopes via the Web Audio API — no dropped frames.
3. Each playback clones the audio node (`cloneNode()`), so rapid-fire shots overlap instead of cutting each other off.

| Key | File | Role |
|:---|:---|:---|
| `shoot` | `sounds/shoot.wav` | Bubble launch |
| `pop` | `sounds/pop.wav` | Bubble burst |
| `meow` / `meow_chirp` | `sounds/meow*.wav` | Cat vocalization (35% chance of the chirp variant; fallback randomizes pitch 0.9–1.15) |
| `thump` | `sounds/thump.wav` | Bubble impact on furniture |
| `reload` | `sounds/reload.wav` | Tank refill complete |
| `unlock` | `sounds/unlock.wav` | Fanfare for new breed / purchase |
| `shape_unlock` | `sounds/shape_unlock.wav` | New bubble shape unlocked |

The `🔊/🔇` HUD toggle mutes both pipelines and the preference is persisted.

---

## 10. Persistence (ADR-003)

Everything is stored locally — **no accounts, no server**. The `safeStorage` adapter
(`src/utils/safe-storage.js`) probes `localStorage` at startup and transparently falls back to an in-memory
`Map` when storage is disabled or full, so the game still runs.

| Key | Contents |
|:---|:---|
| `cat_shooter_high_score` | Best Challenge-mode score |
| `bubble_cat_settings` | JSON `{maxAmmo, minCats, cooldownDuration}` |
| `cute_cat_collection` | Array of unlocked cat breed ids |
| `cute_cat_unlocked_shapes` | Array of unlocked bubble shape ids |
| `cat_shooter_paw_points` | Wallet balance 🐾 |
| `cat_shooter_owned_items` | Array of purchased item ids |
| `cat_shooter_equipped_gun_skin` / `..._gun_effect` | Currently equipped cosmetics |
| `cat_shooter_equipped_cat_accessories` | JSON of the 4 accessory slots |
| `cat_shooter_muted` | Mute state |

**Settings → Factory Reset** (🗑️) wipes scores, album, shapes, shop inventory and settings.

---

## 11. Technical architecture

### Source tree

```
index.html                 # Canvas + HUD/overlays/modals + UI event wiring (inline ES module)
test-runner.html           # Browser-based unit test runner
run.bat / run.sh           # Launchers: tests + HTTP server + open browser
src/
  main.js                  # Game orchestrator: loop, states, collisions, draw order
  systems/
    cannon.js              # First-person blaster: aim, glide, cooldown, 5 skins, crosshair
    spawner.js             # Cat spawning, rarity weights, bad-luck & discovery pity, turnover
    shop-manager.js        # Paw Points wallet, buy/equip/unequip, persistence
  entities/
    cat.js                 # 10-state machine, leap physics, breed rendering, accessories
    bubble.js              # Bubble physics (perspective, ceiling rebound), 8 shapes, BubblePool
    particle.js            # ParticlePool: droplet / heart / star / splat
    prop.js                # 35 prop types, spring wobble, paint splats, startling hidden cats
  scenes/scene-manager.js  # 8 STAGE_CONFIGS, backgrounds, ambient systems, unlock APIs
  audio/
    audio-manager.js       # wav-first pipeline with synthesizer fallback
    synthesizer.js         # Procedural Web Audio API sound generation
  data/
    cat-catalog.js         # 12 breeds + 8 bubble shape definitions
    shop-catalog.js        # 23 cosmetic items
  utils/
    math-physics.js        # clamp / lerp / distance / AABB / circle / spring / hexToRgba
    safe-storage.js        # localStorage wrapper with in-memory fallback
tests/
  unit-tests.js            # 10 suites, 36 tests
  cli-runner.js            # Node.js runner (exit code 1 on failure)
sounds/                    # 8 .wav assets
docs/ADRs, docs/PDRs       # Architecture & product decision records
aidlc-docs/                # TP AI-SDLC artifact set (inception / construction / operations)
```

### Game loop

```
requestAnimationFrame(loop)
  ├─ dt = min((t - lastTime)/1000, 0.05)      # clamped: safe after tab suspend
  ├─ if state == PLAYING → update(dt)
  │     challenge timer → combo timer → toast timer
  │     cannon.update(dt) → sceneManager.update(dt) (ambients) → prop.update(dt)
  │     spawner.update(dt) → bubblePool.update(dt) → particlePool.update(dt)
  │     checkCollisions()  → cats / birds / props (with depth filtering)
  └─ render()  (draw order): background+ambients → props → cats (+accessories) → bubbles
              → particles → blaster & crosshair → toast
```

### Engineering decisions

* **No bundler, no framework** (ADR-001): native ES Modules, so serving the folder is the whole deployment.
* **Object pooling**: `BubblePool(70)` and `ParticlePool(250)` reuse instances, preventing GC spikes during
  rapid fire and heavy particle bursts.
* **Zero layout thrashing**: `getBoundingClientRect()` is cached and only refreshed on `resize` / `scroll`
  (passive listeners), so `mousemove` never forces a reflow.
* **Dirty-checked HUD**: `updateHUD()` runs every frame but writes to the DOM only when score, clock, ammo,
  cooldown, collection badge (x/12) or wallet value actually changes.
* **UI decoupled from the engine**: the engine publishes `window.onPointsUpdated`, `window.onShapeUnlocked` and
  `window.onGameFinished` hooks consumed by `index.html`, which also lets `src/` run head-less under Node for tests.
* **Responsive**: the internal canvas is fixed at 1280×720; CSS letter-scales it at 16:9 and pointer
  coordinates are converted back through `scaleX` / `scaleY`.
* **Robustness**: the update loop is wrapped in `try/catch` and always reschedules `requestAnimationFrame`,
  so a single bad frame cannot kill the game.

---

## 12. Non-functional requirements (as specified)

| Category | Target |
|:---|:---|
| Performance | Steady 60 FPS on mid-tier hardware (i3 / 4 GB RAM); update+draw budget ≤ 10 ms per frame |
| Startup | < 800 ms from page load to an interactive title screen |
| Memory | JS heap ≤ 35 MB under sustained play; total package < 5 MB; no leaks while cats/bubbles churn |
| Usability | Aim latency < 16 ms; touch targets ≥ 48×48 px; multimodal feedback (motion + sound + hearts) |
| Accessibility | UI text contrast meets WCAG 2.1 AA; pointer and touch are 100% equivalent |
| Reliability | Audio failure → synthesizer fallback; corrupted/disabled storage → defaults + in-memory; resize/orientation keeps 16:9 |
| Privacy | **Zero telemetry**, no cookies, no ads, no outbound data → COPPA / GDPR-K friendly for children |

---

## 13. Automated testing

```bash
node tests/cli-runner.js          # CLI: prints ✔/✘ per test plus totals, exit code 1 on failure
# or open http://127.0.0.1:8088/test-runner.html   # same suite inside the browser
```

Ten suites, **36 tests — 36 PASS / 0 FAIL**:

1. Math & physics utilities (`distance`, `lerp`, `clamp`, circle–circle / circle–AABB, spring, `hexToRgba`)
2. SafeStorage (adapter behavior and environments without `localStorage`)
3. Cat catalog integrity (12 breeds, unique ids, valid palettes and shape rewards)
4. Cannon & water-tank cooldown (ammo limits, fire lock during reload, instant refill at `duration = 0`)
5. Spawner & rarity distribution (weights, tiers, bad-luck protection, discovery pity)
6. Props & flush-out mechanics (startle, splats, spring wobble)
7. Cat state machine and hit tinting
8. SceneManager and collection progress
9. Player settings and the 8-stage expansion
10. Shop system and multi-slot cat outfits

---

## 14. Built with TP AI-SDLC version 4

The whole game was produced through the **TP AI-SDLC v4** workflow (AI-accelerated Software Development
Life Cycle) with **Gemini 3.8 Flash** as the AI model, driven by the harness
`python -B .tp-aidlc/package/tools/tp.py`.

| Phase | Main artifacts |
|:---|:---|
| **Inception** (S0–S8) | Requirements, 13 user stories (100% DoR), 6 features, personas, application design, 6 PDRs + 3 ADRs |
| **Construction** (S9–S13) | Functional design (domain entities, business rules, business-logic model), NFR requirements & design, code generation plan |
| **Build & Test** (S14) | Build instructions, test execution report, coverage validation (80% threshold) |
| **Operations** (S15) | Deployment instructions, monitoring setup, runbooks, support procedures, operational readiness review |

Lifecycle status: **S0–S15 complete**, 29 gates PASS, production readiness score 18/20
(see `aidlc-docs/aidlc-state.md`, `aidlc-docs/inception/inception-summary.md`, `docs/ADRs/`, `docs/PDRs/`).

Note: the process artifacts in `aidlc-docs/` and the harness in `.tp-aidlc*/` are listed in `.gitignore`, so a
published copy contains the game itself, the ADR/PDR records, the audio assets and the test suite.

---

## 15. License & Credits

* **License**: MIT — see [LICENSE](LICENSE). You may use, modify and redistribute.
* **Author**: **Thai Phung (Thái Phùng)** — Ho Chi Minh City, Vietnam, 2026. The author credit is also embedded
  in the product: on the **title screen** and as a small badge in the **bottom-right corner** during gameplay.
* **Tooling**: developed with **TP AI-SDLC version 4** and the **Gemini 3.8 Flash** AI model.
* **Content**: the 12 breed descriptions were written for educational entertainment. All artwork (cats, blasters,
  props, backdrops) is **procedurally drawn with Canvas 2D** — no external image assets — and sound consists of
  the 8 `.wav` files in `sounds/` plus the Web Audio fallback synthesizer.

> 🐾 Enjoy relaxing with the cats. If one of them jumps onto the bookshelf and looks back at you — that was on purpose.
