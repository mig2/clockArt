import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import AnalogClock from '../AnalogClock/AnalogClock'
import { useDigitDesign } from '../../contexts/DigitDesignContext'
import { useDigitTransition } from '../../hooks/useDigitTransition'
import type { DigitAngles, TransitionStrategy } from '../../animation'
import './DigitDisplay.css'

type DigitResolver = (digit: string) => { hour: number; minute: number }[]

/** Convert a digit character to DigitAngles using a resolver */
function digitToAngles(digit: string, resolve: DigitResolver): DigitAngles {
  const pattern = resolve(digit)
  if (!pattern || pattern.length === 0) return Array(6).fill({ hour: 0, minute: 0 })
  return pattern.map((c) => ({ hour: c.hour, minute: c.minute }))
}

/** Handle exposed to parent via ref */
export interface DigitDisplayHandle {
  /** Animate from current state to the given digit */
  animateTo: (digit: string, strategy: TransitionStrategy, duration: number) => void
  /** Set digit immediately without animation */
  setDigit: (digit: string) => void
  /** Whether an animation is currently running */
  isAnimating: boolean
}

interface DigitDisplayProps {
  /** The digit to display ("0"-"9") */
  digit: string
  /** Size of each individual analog clock in the grid (px) */
  clockSize?: number
  /** Gap between clocks in the grid (px) */
  gap?: number
}

const DigitDisplay = forwardRef<DigitDisplayHandle, DigitDisplayProps>(
  function DigitDisplay({ digit, clockSize = 80, gap = 2 }, ref) {
    const { getActiveDigit } = useDigitDesign()
    const transition = useDigitTransition(digitToAngles(digit, getActiveDigit))
    const currentDigitRef = useRef(digit)

    // Expose animation control to parent
    useImperativeHandle(ref, () => ({
      animateTo: (targetDigit: string, strategy: TransitionStrategy, duration: number) => {
        transition.animateTo(digitToAngles(targetDigit, getActiveDigit), strategy, duration)
        currentDigitRef.current = targetDigit
      },
      setDigit: (d: string) => {
        transition.setAngles(digitToAngles(d, getActiveDigit))
        currentDigitRef.current = d
      },
      get isAnimating() {
        return transition.isAnimating
      },
    }), [transition, getActiveDigit])

    // When the digit prop changes externally (without animation), we defer
    // the snap by one animation frame. This gives the parent's useEffect a
    // chance to call animateTo first. If an animation is running by the time
    // the deferred callback fires, we skip the snap — the animation is
    // already handling the transition.
    useEffect(() => {
      if (digit !== currentDigitRef.current) {
        currentDigitRef.current = digit
        const rafId = requestAnimationFrame(() => {
          if (!transition.isAnimating) {
            transition.setAngles(digitToAngles(digit, getActiveDigit))
          }
        })
        return () => cancelAnimationFrame(rafId)
      }
    }, [digit, transition, getActiveDigit])

    // When the active design changes (e.g. user sets a custom design),
    // update the displayed angles to reflect the new design.
    const prevResolverRef = useRef(getActiveDigit)
    useEffect(() => {
      if (prevResolverRef.current !== getActiveDigit) {
        prevResolverRef.current = getActiveDigit
        if (!transition.isAnimating) {
          transition.setAngles(digitToAngles(currentDigitRef.current, getActiveDigit))
        }
      }
    }, [getActiveDigit, transition])

    return (
      <div
        className="digit-display"
        style={{
          gridTemplateColumns: `repeat(2, ${clockSize}px)`,
          gridTemplateRows: `repeat(3, ${clockSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {transition.angles.map((a, i) => (
          <div key={i} className="digit-display-cell">
            <AnalogClock
              size={clockSize}
              hourAngleDeg={a.hour}
              minuteAngleDeg={a.minute}
              showSecondHand={false}
            />
          </div>
        ))}
      </div>
    )
  },
)

export default DigitDisplay
