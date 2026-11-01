/**
 * Cute Cat Bubble Shooter - Shop & Customization Manager
 * Manages currency (Paw Points), purchases, inventory, and equipment slots.
 */

import { safeStorage } from '../utils/safe-storage.js';
import { SHOP_CATALOG, SHOP_MAP, SHOP_ITEM_TYPES, CAT_SLOTS } from '../data/shop-catalog.js';

const STORAGE_KEYS = {
  PAW_POINTS: 'cat_shooter_paw_points',
  OWNED_ITEMS: 'cat_shooter_owned_items',
  EQUIPPED_GUN_SKIN: 'cat_shooter_equipped_gun_skin',
  EQUIPPED_GUN_EFFECT: 'cat_shooter_equipped_gun_effect',
  EQUIPPED_CAT_ACCESSORIES: 'cat_shooter_equipped_cat_accessories'
};

export class ShopManager {
  constructor() {
    this.pawPoints = 0;
    this.ownedItems = new Set(['classic_blaster', 'none_effect']);
    this.equippedGunSkin = 'classic_blaster';
    this.equippedGunEffect = 'none_effect';
    this.equippedCatAccessories = {
      [CAT_SLOTS.HEAD]: null,
      [CAT_SLOTS.FACE]: null,
      [CAT_SLOTS.BACK]: null,
      [CAT_SLOTS.AURA]: null
    };

    this.loadState();
  }

  loadState() {
    try {
      // 1. Points
      const rawPoints = safeStorage.getItem(STORAGE_KEYS.PAW_POINTS);
      this.pawPoints = rawPoints ? Math.max(0, parseInt(rawPoints, 10) || 0) : 0;

      // 2. Owned items
      const rawOwned = safeStorage.getItem(STORAGE_KEYS.OWNED_ITEMS);
      if (rawOwned) {
        const parsed = JSON.parse(rawOwned);
        if (Array.isArray(parsed)) {
          this.ownedItems = new Set(parsed);
        }
      }
      this.ownedItems.add('classic_blaster');
      this.ownedItems.add('none_effect');

      // 3. Gun Skin
      const rawSkin = safeStorage.getItem(STORAGE_KEYS.EQUIPPED_GUN_SKIN);
      if (rawSkin && this.ownedItems.has(rawSkin)) {
        this.equippedGunSkin = rawSkin;
      }

      // 4. Gun Effect
      const rawEffect = safeStorage.getItem(STORAGE_KEYS.EQUIPPED_GUN_EFFECT);
      if (rawEffect && this.ownedItems.has(rawEffect)) {
        this.equippedGunEffect = rawEffect;
      }

      // 5. Cat Accessories
      const rawCatAcc = safeStorage.getItem(STORAGE_KEYS.EQUIPPED_CAT_ACCESSORIES);
      if (rawCatAcc) {
        const parsed = JSON.parse(rawCatAcc);
        if (parsed && typeof parsed === 'object') {
          for (const slot of Object.values(CAT_SLOTS)) {
            const accId = parsed[slot];
            if (accId && this.ownedItems.has(accId)) {
              this.equippedCatAccessories[slot] = accId;
            } else {
              this.equippedCatAccessories[slot] = null;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load shop state', e);
    }
  }

  saveState() {
    try {
      safeStorage.setItem(STORAGE_KEYS.PAW_POINTS, this.pawPoints.toString());
      safeStorage.setItem(STORAGE_KEYS.OWNED_ITEMS, JSON.stringify(Array.from(this.ownedItems)));
      safeStorage.setItem(STORAGE_KEYS.EQUIPPED_GUN_SKIN, this.equippedGunSkin);
      safeStorage.setItem(STORAGE_KEYS.EQUIPPED_GUN_EFFECT, this.equippedGunEffect);
      safeStorage.setItem(STORAGE_KEYS.EQUIPPED_CAT_ACCESSORIES, JSON.stringify(this.equippedCatAccessories));
    } catch (e) {
      console.warn('Failed to save shop state', e);
    }
  }

  addPoints(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return this.pawPoints;
    this.pawPoints += Math.floor(amount);
    this.saveState();
    return this.pawPoints;
  }

  isOwned(itemId) {
    return this.ownedItems.has(itemId);
  }

  buyItem(itemId) {
    const item = SHOP_MAP.get(itemId);
    if (!item) {
      return { success: false, reason: 'Vật phẩm không tồn tại' };
    }

    if (this.isOwned(itemId)) {
      return { success: false, reason: 'Bạn đã sở hữu vật phẩm này' };
    }

    if (this.pawPoints < item.price) {
      return { 
        success: false, 
        reason: `Không đủ điểm thưởng! Còn thiếu ${(item.price - this.pawPoints).toLocaleString()} điểm.` 
      };
    }

    this.pawPoints -= item.price;
    this.ownedItems.add(itemId);

    // Auto-equip on purchase
    if (item.type === SHOP_ITEM_TYPES.GUN_SKIN) {
      this.equippedGunSkin = itemId;
    } else if (item.type === SHOP_ITEM_TYPES.GUN_EFFECT) {
      this.equippedGunEffect = itemId;
    } else if (item.type === SHOP_ITEM_TYPES.CAT_ACCESSORY) {
      this.equippedCatAccessories[item.slot] = itemId;
    }

    this.saveState();
    return { success: true, item };
  }

  equipItem(itemId) {
    const item = SHOP_MAP.get(itemId);
    if (!item || !this.isOwned(itemId)) return false;

    if (item.type === SHOP_ITEM_TYPES.GUN_SKIN) {
      this.equippedGunSkin = itemId;
    } else if (item.type === SHOP_ITEM_TYPES.GUN_EFFECT) {
      this.equippedGunEffect = itemId;
    } else if (item.type === SHOP_ITEM_TYPES.CAT_ACCESSORY) {
      this.equippedCatAccessories[item.slot] = itemId;
    }

    this.saveState();
    return true;
  }

  unequipItem(slotOrType, slotKey = null) {
    if (slotOrType === SHOP_ITEM_TYPES.GUN_SKIN) {
      this.equippedGunSkin = 'classic_blaster';
    } else if (slotOrType === SHOP_ITEM_TYPES.GUN_EFFECT) {
      this.equippedGunEffect = 'none_effect';
    } else if (slotOrType === SHOP_ITEM_TYPES.CAT_ACCESSORY && slotKey) {
      this.equippedCatAccessories[slotKey] = null;
    } else if (Object.values(CAT_SLOTS).includes(slotOrType)) {
      this.equippedCatAccessories[slotOrType] = null;
    }

    this.saveState();
    return true;
  }

  isEquipped(itemId) {
    if (this.equippedGunSkin === itemId) return true;
    if (this.equippedGunEffect === itemId) return true;
    for (const slot of Object.values(CAT_SLOTS)) {
      if (this.equippedCatAccessories[slot] === itemId) return true;
    }
    return false;
  }

  resetAllData() {
    this.pawPoints = 0;
    this.ownedItems = new Set(['classic_blaster', 'none_effect']);
    this.equippedGunSkin = 'classic_blaster';
    this.equippedGunEffect = 'none_effect';
    this.equippedCatAccessories = {
      [CAT_SLOTS.HEAD]: null,
      [CAT_SLOTS.FACE]: null,
      [CAT_SLOTS.BACK]: null,
      [CAT_SLOTS.AURA]: null
    };

    safeStorage.removeItem(STORAGE_KEYS.PAW_POINTS);
    safeStorage.removeItem(STORAGE_KEYS.OWNED_ITEMS);
    safeStorage.removeItem(STORAGE_KEYS.EQUIPPED_GUN_SKIN);
    safeStorage.removeItem(STORAGE_KEYS.EQUIPPED_GUN_EFFECT);
    safeStorage.removeItem(STORAGE_KEYS.EQUIPPED_CAT_ACCESSORIES);
  }
}

export const shopManager = new ShopManager();
