import type { DigitAngles, TransitionStrategy } from './types'
import { easeInOutCubic } from './easing'

/**
 * Compute the shortest-path delta between two angles.
 * Returns a value in the range (-180, +180].
 * Positive = clockwise, negative = counterclockwise.
 */
function shortestDelta(from: number, to: number): number {
  let delta = to - from
  // Normalize to (-180, +180]
  while (delta > 180) delta -= 360
  while (delta <= -180) delta += 360
  return delta
}

/** Normalize an angle to [0, 360) */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Shortest path rotation strategy.
 *
 * Each hand independently rotates the shortest angular distance (≤ 180°)
 * to its target. All 12 hands animate simultaneously.
 *
 * @param from - Starting angles for all 6 clocks
 * @param to   - Target angles for all 6 clocks
 * @param t    - Raw progress (0 to 1), easing is applied internally
 */
export const shortestPathStrategy: TransitionStrategy = (
  from: DigitAngles,
  to: DigitAngles,
  t: number,
): DigitAngles => {
  const eased = easeInOutCubic(t)

  return from.map((fromClock, i) => {
    const toClock = to[i]
    return {
      hour: normalizeAngle(fromClock.hour + shortestDelta(fromClock.hour, toClock.hour) * eased),
      minute: normalizeAngle(fromClock.minute + shortestDelta(fromClock.minute, toClock.minute) * eased),
    }
  })
}
