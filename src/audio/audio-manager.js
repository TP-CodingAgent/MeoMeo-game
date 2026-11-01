/**
 * T-P Cute Cat Bubble Shooter - Audio Manager
 * Dual pipeline: HTML5 Audio loading from `sounds/` directory with seamless
 * fallback to procedural Web Audio API Synthesizer (PDR-005, ADR-002).
 */

import { Synthesizer } from './synthesizer.js';
import { safeStorage } from '../utils/safe-storage.js';

export class AudioManager {
  constructor() {
    this.synthesizer = new Synthesizer();
    this.muted = safeStorage.getItem('cat_shooter_muted') === 'true';
    this.audioFiles = {
      shoot: null,
      pop: null,
      meow: null,
      meow_chirp: null,
      thump: null,
      reload: null,
      unlock: null,
      shape_unlock: null
    };
    this.audioSupported = {};
    this.initialized = false;

    this.preloadSounds();
  }

  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.synthesizer.init();
      this.synthesizer.setMuted(this.muted);
    }
  }

  preloadSounds() {
    const soundList = ['shoot', 'pop', 'meow', 'meow_chirp', 'thump', 'reload', 'unlock', 'shape_unlock'];
    soundList.forEach(key => {
      try {
        const audio = new Audio();
        audio.src = `sounds/${key}.wav`;
        audio.preload = 'auto';
        audio.addEventListener('canplaythrough', () => {
          this.audioSupported[key] = true;
        }, { once: true });
        audio.addEventListener('error', () => {
          this.audioSupported[key] = false;
        });
        this.audioFiles[key] = audio;
      } catch (e) {
        this.audioSupported[key] = false;
      }
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    safeStorage.setItem('cat_shooter_muted', this.muted ? 'true' : 'false');
    this.synthesizer.setMuted(this.muted);
    return this.muted;
  }

  // TP-001: Check if audio is muted
  isMuted() {
    return this.muted;
  }

  play(key, synthFallbackMethod, ...args) {
    if (this.muted) return;
    this.init();

    const audioObj = this.audioFiles[key];
    if (audioObj && this.audioSupported[key]) {
      try {
        const clone = audioObj.cloneNode();
        const playPromise = clone.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (this.synthesizer && typeof this.synthesizer[synthFallbackMethod] === 'function') {
              this.synthesizer[synthFallbackMethod](...args);
            }
          });
        }
      } catch (e) {
        if (this.synthesizer && typeof this.synthesizer[synthFallbackMethod] === 'function') {
          this.synthesizer[synthFallbackMethod](...args);
        }
      }
    } else {
      if (this.synthesizer && typeof this.synthesizer[synthFallbackMethod] === 'function') {
        this.synthesizer[synthFallbackMethod](...args);
      }
    }
  }

  playShoot() {
    this.play('shoot', 'playShoot');
  }

  playPop() {
    this.play('pop', 'playPop');
  }

  /**
   * Play sweet kitten meow with random pitch variation
   */
  playMeow() {
    const useChirp = Math.random() < 0.35;
    const key = useChirp ? 'meow_chirp' : 'meow';
    const pitchVariant = 0.9 + Math.random() * 0.25;
    this.play(key, 'playMeow', pitchVariant);
  }

  playThump() {
    this.play('thump', 'playThump');
  }

  // TP-001: Play reload sound
  playReload() {
    this.play('reload', 'playReload');
  }

  playUnlock() {
    this.play('unlock', 'playUnlockFanfare');
  }

  playShapeUnlock() {
    this.play('shape_unlock', 'playShapeUnlock');
  }
}
