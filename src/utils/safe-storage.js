/**
 * Safe Storage Adapter Module
 * Provides localStorage persistence with in-memory fallback.
 * TP AIDLC - Cute Cat Color Water Shooter (ADR-003)
 */

const STORAGE_KEY = 'cute_cat_water_shooter_save_v1';

export class SafeStorage {
  constructor() {
    this.memoryStore = new Map();
    this.isLocalStorageAvailable = this._testLocalStorage();
  }

  _testLocalStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__test_storage__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  getDefaultSaveData() {
    return {
      version: '1.0',
      unlockedCatIds: [],
      highScores: {
        stage1: { score: 0, stars: 0 },
        stage2: { score: 0, stars: 0 },
        stage3: { score: 0, stars: 0 }
      },
      settings: {
        isMuted: false,
        selectedMode: 'relax'
      }
    };
  }

  load() {
    try {
      let raw = null;
      if (this.isLocalStorageAvailable) {
        raw = window.localStorage.getItem(STORAGE_KEY);
      } else {
        raw = this.memoryStore.get(STORAGE_KEY);
      }

      if (!raw) return this.getDefaultSaveData();
      const parsed = JSON.parse(raw);
      return {
        ...this.getDefaultSaveData(),
        ...parsed,
        highScores: {
          ...this.getDefaultSaveData().highScores,
          ...(parsed.highScores || {})
        },
        settings: {
          ...this.getDefaultSaveData().settings,
          ...(parsed.settings || {})
        }
      };
    } catch (e) {
      console.warn('SafeStorage: Failed to parse save data, returning default.', e);
      return this.getDefaultSaveData();
    }
  }

  save(data) {
    try {
      const serialized = JSON.stringify(data);
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        this.memoryStore.set(STORAGE_KEY, serialized);
      }
      return true;
    } catch (e) {
      console.warn('SafeStorage: Save operation failed.', e);
      return false;
    }
  }

  unlockCat(breedId) {
    if (!breedId) return false;
    const data = this.load();
    if (!data.unlockedCatIds.includes(breedId)) {
      data.unlockedCatIds.push(breedId);
      this.save(data);
      return true; // Newly unlocked
    }
    return false; // Already unlocked
  }

  isCatUnlocked(breedId) {
    const data = this.load();
    return data.unlockedCatIds.includes(breedId);
  }

  saveStageScore(stageId, score, stars) {
    const data = this.load();
    if (!data.highScores[stageId]) {
      data.highScores[stageId] = { score: 0, stars: 0 };
    }
    if (score > data.highScores[stageId].score) {
      data.highScores[stageId].score = score;
    }
    if (stars > data.highScores[stageId].stars) {
      data.highScores[stageId].stars = stars;
    }
    this.save(data);
  }

  setMuted(isMuted) {
    const data = this.load();
    data.settings.isMuted = !!isMuted;
    this.save(data);
  }

  getItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        return window.localStorage.getItem(key);
      }
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : null;
    } catch (e) {
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : null;
    }
  }

  setItem(key, value) {
    try {
      const strVal = String(value);
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, strVal);
      }
      this.memoryStore.set(key, strVal);
      return true;
    } catch (e) {
      this.memoryStore.set(key, String(value));
      return false;
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
      return true;
    } catch (e) {
      this.memoryStore.delete(key);
      return false;
    }
  }

  clear() {
    if (this.isLocalStorageAvailable) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    this.memoryStore.clear();
  }
}

export const safeStorage = new SafeStorage();
