import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import AnalogClock from '../AnalogClock/AnalogClock'
import { DIGITS } from '../../data/digits'
import { useDigitTransition } from '../../hooks/useDigitTransition'
import type { DigitAngles, TransitionStrategy } from '../../animation'
import './DigitDisplay.css'

/** Convert a digit character to DigitAngles */
function digitToAngles(digit: string): DigitAngles {
  const pattern = DIGITS[digit]
  if (!pattern) return Array(6).fill({ hour: 0, minute: 0 })
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
    const transition = useDigitTransition(digitToAngles(digit))
    const currentDigitRef = useRef(digit)

    // Expose animation control to parent
    useImperativeHandle(ref, () => ({
      animateTo: (targetDigit: string, strategy: TransitionStrategy, duration: number) => {
        transition.animateTo(digitToAngles(targetDigit), strategy, duration)
        currentDigitRef.current = targetDigit
      },
      setDigit: (d: string) => {
        transition.setAngles(digitToAngles(d))
        currentDigitRef.current = d
      },
      get isAnimating() {
        return transition.isAnimating
      },
    }), [transition])

    // When the digit prop changes externally (without animation), snap to it
    useEffect(() => {
      if (digit !== currentDigitRef.current && !transition.isAnimating) {
        transition.setAngles(digitToAngles(digit))
        currentDigitRef.current = digit
      }
    }, [digit, transition])

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
