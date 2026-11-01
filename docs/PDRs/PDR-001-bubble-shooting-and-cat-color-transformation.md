# PDR-001: Bubble Shooting and Cat Color Transformation

**Date**: 2026-10-31
**Status**: Proposed
**Author(s) / Decision Owner**: User & TP AIDLC Assistant
**Target Personas**: Children, Casual Family Players
**Related Issues / Epics**: [Product Requirements](../../aidlc-docs/inception/product-requirements/product-requirements.md)
**Supersedes**: None
**Superseded by**: None

---

## 1. Problem Statement & Context

In the initial concept, the water gun sprayed a standard single-color water stream. However, for young children, standard water streams can feel repetitive and lack whimsical visual feedback. Furthermore, how the target cats react visually upon being hit needed clear product definition.

---

## 2. Decision Drivers & Business Goals

- Maximize visual delight, whimsy, and engagement for children.
- Provide immediate and rewarding visual feedback when a hit occurs.
- Maintain a strictly gentle, playful, non-violent tone.

---

## 3. Options Evaluated

### Option 1: Color Soap Bubble Projectiles with Full-Body Cat Color Morphing (Selected)

The water gun shoots swirling, translucent soap bubbles in various vibrant colors (bubble gum pink, sky blue, sunny yellow, lavender, neon green). When a bubble hits a cat, the bubble pops with colorful droplet particles, and the cat's whole fur dynamically morphs to match the bubble color while purring and emitting hearts.

**Pros:**
- Highly captivating and magical for kids.
- Multiple bubble colors create variety and creative visual play.

**Cons & Risks:**
- Requires canvas sprite/tinting shader logic for cat color changes.

### Option 2: Standard Water Jet Stream

Standard linear water spray particles that splash off the cat without changing its appearance.

**Why not selected:**
- Less playful; feels like a generic shooting gallery rather than a magical pet wash.

---

## 4. Decision Outcome & Rationale

We selected Option 1. The bubble shooting and color morphing mechanic directly transforms the game from a target shooter into a cheerful, creative color-play experience.

---

## 5. User Journey & Workflow Impact

1. Player aims with mouse/finger and clicks/holds.
2. Gun discharges colorful soap bubbles that float toward the target point with gentle wobbling physics.
3. Upon collision, the bubble bursts into sparkling droplets. The hit cat blushes, leaps happily, turns the color of the bubble, and drops heart icons.

---

## 6. Trade-offs & Migration Plan

### Negative Consequences Accepted
- Slightly higher canvas particle overhead (must manage bubble lifetime and particle count).

---

## 7. Success Metrics & Review Cadence

- **Key Metrics**: Smooth 60 FPS bubble particle rendering with dynamic canvas hue tinting.
- **Scheduled Review Date**: 2026-11-30

---

## 8. Implementation & Architecture Links

- **Governing ADR(s)**: Pending Construction phase
- **User Stories impacted**: US-01 (Aim & Bubble Fire), US-02 (Cat Color Tint Feedback)
