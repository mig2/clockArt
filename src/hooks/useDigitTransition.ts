import { useState, useCallback, useRef } from 'react'
import type { DigitAngles, TransitionStrategy } from '../animation/types'
import { runTransition } from '../animation/engine'

interface UseDigitTransitionReturn {
  /** Current angles for all 6 clocks (updates each frame during animation) */
  angles: DigitAngles
  /** Whether an animation is currently running */
  isAnimating: boolean
  /** Set angles immediately without animation */
  setAngles: (angles: DigitAngles) => void
  /** Animate from current angles to target angles */
  animateTo: (
    target: DigitAngles,
    strategy: TransitionStrategy,
    duration: number,
  ) => void
  /** Cancel any running animation */
  cancel: () => void
}

const DEFAULT_ANGLES: DigitAngles = Array(6).fill({ hour: 0, minute: 0 })

export function useDigitTransition(
  initialAngles: DigitAngles = DEFAULT_ANGLES,
): UseDigitTransitionReturn {
  const [angles, setAnglesState] = useState<DigitAngles>(initialAngles)
  const [isAnimating, setIsAnimating] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  // Keep a ref to the latest angles so animateTo always reads the current value
  const anglesRef = useRef<DigitAngles>(initialAngles)

  const setAngles = useCallback((newAngles: DigitAngles) => {
    // Cancel any running animation
    if (cancelRef.current) {
      cancelRef.current()
      cancelRef.current = null
    }
    setIsAnimating(false)
    anglesRef.current = newAngles
    setAnglesState(newAngles)
  }, [])

  const cancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current()
      cancelRef.current = null
    }
    setIsAnimating(false)
  }, [])

  const animateTo = useCallback(
    (target: DigitAngles, strategy: TransitionStrategy, duration: number) => {
      // Cancel any running animation first
      if (cancelRef.current) {
        cancelRef.current()
      }

      const from = anglesRef.current
      setIsAnimating(true)

      cancelRef.current = runTransition({
        from,
        to: target,
        strategy,
        duration,
        onFrame: (frameAngles) => {
          anglesRef.current = frameAngles
          setAnglesState(frameAngles)
        },
        onComplete: () => {
          anglesRef.current = target
          setAnglesState(target)
          setIsAnimating(false)
          cancelRef.current = null
        },
      })
    },
    [],
  )

  return { angles, isAnimating, setAngles, animateTo, cancel }
}
