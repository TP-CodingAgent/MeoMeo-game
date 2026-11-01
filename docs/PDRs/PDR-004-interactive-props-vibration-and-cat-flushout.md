# PDR-004: Interactive Props with Vibration and Cat Flush-Out

**Date**: 2026-10-31
**Status**: Proposed
**Author(s) / Decision Owner**: User & TP AIDLC Assistant
**Target Personas**: Children, Casual Players
**Related Issues / Epics**: [Product Requirements](../../aidlc-docs/inception/product-requirements/product-requirements.md)
**Supersedes**: None
**Superseded by**: None

---

## 1. Problem Statement & Context

Cats hide behind scenery items (sofas, plant pots, cushions, fences, curtains). How should the environment react when shot?

---

## 2. Decision Drivers & Business Goals

- Rewarding environmental responsiveness.
- Make finding hidden cats an active, playful discovery process.
- Avoid frustrating "dead clicks" on background items.

---

## 3. Options Evaluated

### Option 1: Shaking Props & Cat Scramble on Impact (Selected)
When bubbles hit scenery props, the prop gives a bouncy jiggle/shake animation and color splashes fade softly over 1-2 seconds. If a cat is currently hiding behind that prop, the impact surprises the cat, causing it to jump out into the open with a startled "meow", exposing it for a color wash.

**Pros:**
- Engaging hide-and-seek dynamic. Every shot feels responsive.

**Cons & Risks:**
- Requires tracking occlusion and bounding boxes for props.

### Option 2: Impassable Hard Occluders
Props block all bubbles and cannot be interacted with.

**Why not selected:**
- Passive and dull; forces players to wait idly for cats to move on their own.

---

## 4. Decision Outcome & Rationale

Selected Option 1. Bouncing props and flushing out hidden cats turn every stage into an active, delightful sandbox.
