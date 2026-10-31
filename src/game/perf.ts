/**
 * Low-end device detection.
 *
 * The game ships a hand-painted canvas world, but on cheap phones and low-core
 * devices the per-frame canvas work can still be too much. This module is the
 * single source of truth for "how powerful is this machine", so the engine and
 * the React shell can degrade gracefully instead of jank.
 */

export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const coarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

  const smallScreen =
    typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 480px)').matches;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2;
  const lowCpu = (navigator.hardwareConcurrency ?? 4) <= 2;

  return Boolean(coarsePointer || smallScreen || lowMemory || lowCpu);
}

/** Effective canvas resolution scale for the flight canvas. */
export function getCanvasDpr(lowEnd: boolean): number {
  const raw = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  // Low-end phones get a single low-dpi backing store; mid/high get 2x.
  return Math.min(raw, lowEnd ? 1.25 : 2);
}
