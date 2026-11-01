# ADR-002: Dual Sound Pipeline (External Audio Files with Web Audio API Fallback)

**Date**: 2026-10-31
**Status**: Proposed
**Decision Owner**: Technical Architect & TP AIDLC Assistant
**Technical Story / Context Link**: [PDR-005](../../docs/PDRs/PDR-005-sound-assets-directory-architecture.md)
**Supersedes**: None
**Superseded by**: None

---

## Context

The game requires cheerful sound effects (bubble shooting, popping, purring, meowing, prop bouncing, fanfares) and background music. PDR-005 mandates that audio assets reside in a dedicated `sounds/` directory rather than embedding multi-megabyte base64 strings into source code. However, browsers have security policies (e.g., CORS restrictions when opened directly via `file://`) that can occasionally block `fetch` or `Audio()` asset loading on certain operating systems or locked-down environments.

---

## Decision Drivers

1. **Clean Code Separation**: Source code files must remain compact, human-readable, and free of massive binary data blobs.
2. **Audio Resilience**: Sound must never crash the game, and audio should play under any launch scenario (local web server, static CDN, or local filesystem).
3. **Low Latency Playback**: Instant sound triggering upon bubble burst or cat contact.

---

## Options Considered

### Option 1: Dedicated `sounds/` Folder with Automatic Web Audio Synthesizer Fallback (Selected)
Audio assets are kept as discrete lightweight audio files in `sounds/`. The `AudioManager` attempts to load these files. If loading fails or is blocked by browser local-file policies, it transparently falls back to an embedded Web Audio API frequency synthesizer (generating bubble pops, water zips, and meow tones using oscillators).

**Pros:**
- Keeps source files clean and lightweight.
- Guarantees 100% audio availability under all execution contexts.

**Cons & Trade-offs:**
- Requires implementing a small Web Audio synthesizer helper class.

### Option 2: Pure File-based Audio Only (No Fallback)
Rely solely on files in `sounds/`.

**Why not selected:**
- If opened directly via `file://` in browsers with strict local file isolation, sound could fail silently.

---

## Decision

We chose **Option 1**. The hybrid loading pipeline ensures high architectural hygiene with zero failure risk.

---

## Consequences

### Positive Consequences
- Source files remain under 20KB each.
- Audio plays reliably everywhere.
