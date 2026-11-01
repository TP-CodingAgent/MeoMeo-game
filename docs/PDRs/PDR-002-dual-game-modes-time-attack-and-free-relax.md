# PDR-002: Dual Game Modes (Time Attack vs Free Relax)

**Date**: 2026-10-31
**Status**: Proposed
**Author(s) / Decision Owner**: User & TP AIDLC Assistant
**Target Personas**: Toddlers & Young Children (Relax Mode), Older Kids & Casual Gamers (Time Attack)
**Related Issues / Epics**: [Product Requirements](../../aidlc-docs/inception/product-requirements/product-requirements.md)
**Supersedes**: None
**Superseded by**: None

---

## 1. Problem Statement & Context

Different age groups have distinct cognitive requirements. Young toddlers can be frustrated by countdown timers and fail states, while older children enjoy goals, timers, and star ratings.

---

## 2. Decision Drivers & Business Goals

- Adaptable gameplay accessibility across ages 3 to 10+.
- No forced failure states for young children.
- Clear sense of challenge and progression for players seeking it.

---

## 3. Options Evaluated

### Option 1: Dual Game Modes (Selected)
Provide two modes selectable at start and stage selection:
- **Free Relax Mode**: No timer, no fail state. Cats spawn indefinitely, player can pop bubbles and color cats freely, with a "Next Stage" button whenever ready.
- **Time Attack Mode**: 60-second timer per stage. Target quota of cats to wash. Star rating (1-3 stars) based on score and time remaining.

**Pros:**
- Universal appeal; toddlers play stress-free while older kids get arcade excitement.

**Cons & Risks:**
- Requires separate stage state controllers.

### Option 2: Fixed Countdown Timer Only
Every player must race against a clock.

**Why not selected:**
- Punitive for toddlers with slower fine motor skills.

---

## 4. Decision Outcome & Rationale

We selected Option 1 to satisfy both casual relaxation and arcade fun without alienating young players.

---

## 5. User Journey & Workflow Impact

1. Main menu allows choosing "Chơi Thư Giãn (Free Relax)" or "Thử Thách Thời Gian (Time Attack)".
2. Stage transitions honor the chosen mode.
