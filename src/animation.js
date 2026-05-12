/**
 * ─── Ghoomar Thali — Centralized Animation Config ────────────────────────────
 * Single source of truth for all animation constants.
 * Import from here; never hard-code magic numbers in components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Scroll scrub ──────────────────────────────────────────────────────────────
/** Standard scrub for most scroll-linked animations */
export const SCRUB = 0.7;
/** Tighter scrub for pinned section panels (feels more "locked") */
export const SCRUB_TIGHT = 0.5;
/** Looser scrub for slow ambient parallax */
export const SCRUB_PARALLAX = 1.4;

// ── Easing ────────────────────────────────────────────────────────────────────
export const EASE_ROYAL   = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const EASE_SILK    = 'power3.out';
export const EASE_IN_SOFT = 'power2.inOut';

// ── Duration presets (seconds) ────────────────────────────────────────────────
export const DUR_FAST   = 0.7;
export const DUR_MED    = 1.0;
export const DUR_SLOW   = 1.4;
export const DUR_CINEMA = 1.8;

// ── Bloom filter presets ──────────────────────────────────────────────────────
export const BLUR_IN  = 'blur(14px) brightness(1.4)';
export const BLUR_OUT = 'blur(0px) brightness(1)';
export const BLUR_SUBTLE_IN = 'blur(8px)';

// ── Section entry defaults (used by SectionReveal) ───────────────────────────
export const SECTION_ENTRY = {
  /** How far below the viewport the trigger fires */
  start: 'top 82%',
  /** How far into the viewport by the time the entry is complete */
  end:   'top 22%',
  scrub: SCRUB,
  fromY: 40,
  fromOpacity: 0,
  fromBlur: 'blur(12px)',
};

// ── Menu section ──────────────────────────────────────────────────────────────
export const MENU_SCRUB = SCRUB;

// ── Culture section ───────────────────────────────────────────────────────────
export const CULTURE_SCRUB = SCRUB;
export const CULTURE_PANEL_OVERLAP = 1.5; // vh multiplier per panel
