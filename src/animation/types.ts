/** Angles for a single clock's two hands */
export interface ClockAngles {
  hour: number
  minute: number
}

/** Full state for a 2×3 digit grid (6 clocks, a–f) */
export type DigitAngles = ClockAngles[]

/** A transition strategy computes the current angles for all clocks at a given progress t (0–1) */
export type TransitionStrategy = (
  from: DigitAngles,
  to: DigitAngles,
  t: number,
) => DigitAngles

/** Options for running a transition animation */
export interface TransitionOptions {
  from: DigitAngles
  to: DigitAngles
  strategy: TransitionStrategy
  duration: number
  onFrame: (angles: DigitAngles) => void
  onComplete: () => void
}
