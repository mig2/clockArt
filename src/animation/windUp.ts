import type { DigitAngles, TransitionStrategy } from './types'
import { easeInOutCubic } from './easing'

/** Normalize an angle to [0, 360) */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * Wind-Up strategy.
 *
 * Every hand rotates **clockwise** through at least one full revolution (360°)
 * before arriving at the target angle. This creates a dramatic "winding" effect
 * where all clocks visibly sweep around before settling.
 *
 * - If the target is different from the start, the hand travels 360° + the
 *   clockwise distance to the target.
 * - If the target equals the start, the hand still completes a full 360° sweep.
 *
 * @param from - Starting angles for all 6 clocks
 * @param to   - Target angles for all 6 clocks
 * @param t    - Raw progress (0 to 1), easing is applied internally
 */
export const windUpStrategy: TransitionStrategy = (
  from: DigitAngles,
  to: DigitAngles,
  t: number,
): DigitAngles => {
  const eased = easeInOutCubic(t)

  return from.map((fromClock, i) => {
    const toClock = to[i]

    // Clockwise delta with at least one full revolution:
    // (target - start + 360) % 360 gives the shortest clockwise distance (0–359°)
    // Adding 360 guarantees at least one full sweep
    const hourDelta = ((toClock.hour - fromClock.hour + 360) % 360) + 360
    const minuteDelta = ((toClock.minute - fromClock.minute + 360) % 360) + 360

    return {
      hour: normalizeAngle(fromClock.hour + hourDelta * eased),
      minute: normalizeAngle(fromClock.minute + minuteDelta * eased),
    }
  })
}
