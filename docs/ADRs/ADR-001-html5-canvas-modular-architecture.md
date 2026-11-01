# ADR-001: Standalone Modular HTML5 Canvas 2D Architecture

**Date**: 2026-10-31
**Status**: Proposed
**Decision Owner**: Technical Architect & TP AIDLC Assistant
**Technical Story / Context Link**: [Requirements](../../aidlc-docs/inception/requirements/requirements.md)
**Supersedes**: None
**Superseded by**: None

---

## Context

The application is a family-friendly gallery shooter featuring bubble physics, cats with dynamic color-shifting fur, interactive background props, and an international cat encyclopedia. We need to select the core rendering and execution architecture: whether to bundle a heavy gaming framework (e.g., Phaser.js, PixiJS) with complex npm/bundling requirements, or design a clean, modular vanilla JavaScript architecture utilizing native HTML5 Canvas 2D and modern ES6 modules.

---

## Decision Drivers

1. **Zero Setup & Instant Execution**: The game must run immediately upon opening `index.html` in any browser without needing `npm install`, Node.js runtimes, or build steps.
2. **Predictable 60 FPS Performance**: Fast, lightweight 2D rendering loop with predictable memory footprint.
3. **Transparent Debuggability & Maintainability**: Clean, decoupled components with straightforward unit testing capabilities.

---

## Options Considered

### Option 1: Vanilla JavaScript (ES6) + Native HTML5 Canvas 2D (Selected)
Build a modular architecture using native Canvas 2D API for rendering, standard `requestAnimationFrame` game loop, and ES6 modular classes.

**Pros:**
- Zero external build dependencies; runs anywhere immediately.
- Ultra-lightweight footprint (<100KB total code).
- Direct control over canvas composite operations for instant cat color morphing.

**Cons & Trade-offs:**
- Requires writing custom collision detection (circle-to-box / circle-to-circle) and simple particle emitters.

### Option 2: Phaser 3 Framework
Bundle Phaser 3 engine via CDN or webpack.

**Pros:**
- Built-in physics, scene management, and sprite animations.

**Cons & Trade-offs:**
- Heavy bundle size (>1MB minified).
- Requires build pipelines or external CDN connectivity (fails offline).
- Excessive complexity for a fixed gallery shooter.

---

## Decision

We chose **Option 1: Vanilla JavaScript (ES6) + Native HTML5 Canvas 2D**. It guarantees instant offline usability, minimal memory footprint, and full compliance with lightweight web delivery.

---

## Consequences

### Positive Consequences
- Immediate execution by double-clicking `index.html`.
- No bundler or dependency vulnerabilities.
- Easily testable through headless unit tests.

### Negative Consequences & Liabilities
- Custom implementation of bubble trajectory and collision math (well within scope and covered in US-01/US-03/US-13).
