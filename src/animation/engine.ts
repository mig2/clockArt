import type { TransitionOptions } from './types'

/**
 * Runs a digit transition animation using requestAnimationFrame.
 * Returns a cancel function to abort the animation early.
 */
export function runTransition(options: TransitionOptions): () => void {
  const { from, to, strategy, duration, onFrame, onComplete } = options
  let cancelled = false
  let startTime: number | null = null

  function tick(now: number) {
    if (cancelled) return

    if (startTime === null) {
      startTime = now
    }

    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const angles = strategy(from, to, t)

    onFrame(angles)

    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onComplete()
    }
  }

  requestAnimationFrame(tick)

  return () => {
    cancelled = true
  }
}
