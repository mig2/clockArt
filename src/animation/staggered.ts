import type { DigitAngles, TransitionStrategy } from './types'
import { easeInOutCubic } from './easing'

/**
 * Compute the shortest-path delta between two angles.
 * Returns a value in the range (-180, +180].
 */
function shortestDelta(from: number, to: number): number {
  let delta = to - from
  while (delta > 180) delta -= 360
  while (delta <= -180) delta += 360
  return delta
}

/** Normalize an angle to [0, 360) */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Row assignments: clocks 0,1 = row 0 (ab), clocks 2,3 = row 1 (cd), clocks 4,5 = row 2 (ef)
 */
function rowForClock(index: number): number {
  return Math.floor(index / 2)
}

/**
 * Staggered/sequential strategy.
 *
 * Animates row by row (ab → cd → ef). Each row's clocks use shortest-path
 * rotation. Rows overlap: each row starts after a stagger delay, and all
 * rows use the same per-row animation duration.
 *
 * Timeline layout (3 rows):
 *   Row 0: starts at t=0,   ends at t=rowDuration
 *   Row 1: starts at t=stagger, ends at t=stagger+rowDuration
 *   Row 2: starts at t=2*stagger, ends at t=2*stagger+rowDuration
 *   Total duration = 2*stagger + rowDuration
 *
 * We map the global t (0–1) to per-row local progress using these windows.
 * Each row gets ~60% of the total time for its animation, with ~20% stagger between rows.
 *
 * @param from - Starting angles for all 6 clocks
 * @param to   - Target angles for all 6 clocks
 * @param t    - Raw progress (0 to 1) over the total animation duration
 */
export const staggeredStrategy: TransitionStrategy = (
  from: DigitAngles,
  to: DigitAngles,
  t: number,
): DigitAngles => {
  const NUM_ROWS = 3
  // Each row gets a stagger offset of 1/(NUM_ROWS+1) of total time
  // and a row animation window of 2/(NUM_ROWS+1) of total time
  // This gives overlap: row 0 is still animating when row 1 starts
  const stagger = 1 / (NUM_ROWS + 1)    // 0.25
  const rowDuration = 2 * stagger         // 0.50
  // Total span: (NUM_ROWS-1)*stagger + rowDuration = 0.5 + 0.5 = 1.0 ✓

  return from.map((fromClock, i) => {
    const toClock = to[i]
    const row = rowForClock(i)

    // Map global t to this row's local progress
    const rowStart = row * stagger
    const rowEnd = rowStart + rowDuration
    const localT = Math.max(0, Math.min(1, (t - rowStart) / (rowEnd - rowStart)))
    const eased = easeInOutCubic(localT)

    return {
      hour: normalizeAngle(fromClock.hour + shortestDelta(fromClock.hour, toClock.hour) * eased),
      minute: normalizeAngle(fromClock.minute + shortestDelta(fromClock.minute, toClock.minute) * eased),
    }
  })
}
