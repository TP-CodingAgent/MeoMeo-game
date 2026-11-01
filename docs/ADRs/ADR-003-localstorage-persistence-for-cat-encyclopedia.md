# ADR-003: LocalStorage Persistence for Cat Encyclopedia & Player Progress

**Date**: 2026-10-31
**Status**: Proposed
**Decision Owner**: Technical Architect & TP AIDLC Assistant
**Technical Story / Context Link**: [PDR-006](../../docs/PDRs/PDR-006-international-cat-encyclopedia-and-collection.md)
**Supersedes**: None
**Superseded by**: None

---

## Context

The game introduces an International Cat Encyclopedia where hitting a cat unlocks it permanently into an album with rarity levels (1-5 stars). Player progress (collected cat IDs, high scores, audio preferences) must persist across page refreshes and browser sessions.

---

## Decision Drivers

1. **Zero Backend Requirement**: No server, no external database, no network dependencies.
2. **Synchronous Simplicity & Reliability**: Lightweight, atomic reading and writing.
3. **Cross-Session Retention**: Preserving unlocked cats so children don't lose their collected medals.

---

## Options Considered

### Option 1: Browser `localStorage` (Selected)
Store an immutable schema JSON string under key `cute_cat_shooter_save` containing an array of unlocked cat IDs, highest stage reached, star ratings, and audio settings.

**Pros:**
- Universal browser support across 100% of modern devices.
- Synchronous, fast, and simple to mock in headless tests.
- Perfect fit for < 50KB structured save data.

**Cons & Trade-offs:**
- Limited to ~5MB per origin (game save requires < 10KB, negligible impact).

### Option 2: IndexedDB
Asynchronous object store.

**Why not selected:**
- Overkill for simple save states; introduces async callback complexity and overhead.

---

## Decision

We chose **Option 1: Browser `localStorage`**. It provides zero-overhead, dependable client-side persistence.
