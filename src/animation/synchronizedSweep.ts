import type { DigitAngles, TransitionStrategy } from './types'
import { easeInOutCubic } from './easing'

/** Normalize an angle to [0, 360) */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Synchronized sweep strategy.
 *
 * All hands rotate **clockwise only** at the same duration.
 * Hands with larger angular distances move faster.
 * Hands already at their target stay still.
 *
 * @param from - Starting angles for all 6 clocks
 * @param to   - Target angles for all 6 clocks
 * @param t    - Raw progress (0 to 1), easing is applied internally
 */
export const synchronizedSweepStrategy: TransitionStrategy = (
  from: DigitAngles,
  to: DigitAngles,
  t: number,
): DigitAngles => {
  const eased = easeInOutCubic(t)

  return from.map((fromClock, i) => {
    const toClock = to[i]

    // Clockwise delta: always positive, 0 means no movement
    const hourDelta = (toClock.hour - fromClock.hour + 360) % 360
    const minuteDelta = (toClock.minute - fromClock.minute + 360) % 360

    return {
      hour: normalizeAngle(fromClock.hour + hourDelta * eased),
      minute: normalizeAngle(fromClock.minute + minuteDelta * eased),
    }
  })
}
