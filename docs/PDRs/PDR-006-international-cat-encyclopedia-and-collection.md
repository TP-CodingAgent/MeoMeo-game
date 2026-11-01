# PDR-006: International Cat Collection and Encyclopedia System

**Date**: 2026-10-31
**Status**: Proposed
**Author(s) / Decision Owner**: User & TP AIDLC Assistant
**Target Personas**: Children, Cat Lovers, Casual Gamers
**Related Issues / Epics**: [Product Requirements](../../aidlc-docs/inception/product-requirements/product-requirements.md)
**Supersedes**: None
**Superseded by**: None

---

## 1. Problem Statement & Context

Pure gallery shooters can suffer from low long-term replayability once all stages are played once. Children love collecting, discovering surprises, and learning about animals.

---

## 2. Decision Drivers & Business Goals

- Provide strong replay value and discovery motivation.
- Educational value: teach children about cat breeds from around the world.
- Clear visual distinction between locked (uncollected) and unlocked (collected) cats.

---

## 3. Options Evaluated

### Option 1: International Cat Encyclopedia with Rarity 1-5 Stars and Ribbon UI (Selected)
- A diverse roster of cats from various countries (e.g., British Shorthair 🇬🇧, Japanese Bobtail 🇯🇵, Siamese 🇹🇭, Maine Coon 🇺🇸, Sphynx 🇨🇦, Russian Blue 🇷🇺, Bengal 🇺🇸, Turkish Van 🇹🇷, Vietnamese Yellow/Dragon-Li 🇻🇳).
- Each cat has a rarity rating from 1 to 5 stars (⭐ to ⭐⭐⭐⭐⭐). Rare cats have lower random spawn rates during stages.
- Successfully hitting a cat during gameplay permanently unlocks it in the player's Collection Album (stored in `localStorage`).
- Dedicated Collection Album Screen:
  - Uncollected cats are shown as dark mystery silhouettes with lock icons.
  - Collected cats glow brightly and feature an ornate festive fabric ribbon / sash wrapped around the lower portion of their portrait.
- Clicking any collected cat opens a detailed Encyclopedia Modal:
  - Name and Country of Origin (with flag icon).
  - Star Rarity (1 to 5).
  - Brief History and cultural origin.
  - Physical appearance characteristics.
  - Temperament and personality traits.

**Pros:**
- Educational, rewarding, and highly collectible.
- Keeps kids engaged across multiple play sessions.

**Cons & Risks:**
- Requires structured cat database and modal UI styling.

---

## 4. Decision Outcome & Rationale

Selected Option 1. This transforms the game from a simple arcade shooter into a rich, educational, collectible adventure.
