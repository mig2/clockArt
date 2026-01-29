import { useRef, useEffect, useState } from 'react'
import DigitDisplay from '../DigitDisplay/DigitDisplay'
import type { DigitDisplayHandle } from '../DigitDisplay/DigitDisplay'
import ColonSeparator from '../ColonSeparator/ColonSeparator'
import SevenSegment from '../SevenSegment/SevenSegment'
import { useClockTime } from '../../hooks/useClockTime'
import {
  shortestPathStrategy,
  synchronizedSweepStrategy,
  staggeredStrategy,
  windUpStrategy,
} from '../../animation'
import type { TransitionStrategy } from '../../animation'
import './ClockScreen.css'

type AlgorithmKey = 'shortest' | 'sweep' | 'staggered' | 'windUp'

const ALGORITHMS: Record<AlgorithmKey, { label: string; strategy: TransitionStrategy }> = {
  shortest: { label: 'Shortest Path', strategy: shortestPathStrategy },
  sweep: { label: 'Synchronized Sweep', strategy: synchronizedSweepStrategy },
  staggered: { label: 'Staggered', strategy: staggeredStrategy },
  windUp: { label: 'Wind-Up', strategy: windUpStrategy },
}

/** Split hours and minutes into individual digit strings */
function timeToDigits(hours: number, minutes: number): [string, string, string, string] {
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return [hh[0], hh[1], mm[0], mm[1]]
}

const CLOCK_SIZE = 80
const CLOCK_GAP = 2
const GRID_HEIGHT = CLOCK_SIZE * 3 + CLOCK_GAP * 2
const TRANSITION_DURATION = 600

function ClockScreen() {
  const { time } = useClockTime()
  const [algorithm] = useState<AlgorithmKey>('shortest')

  // Refs for HH:MM digit displays
  const h1Ref = useRef<DigitDisplayHandle>(null)
  const h2Ref = useRef<DigitDisplayHandle>(null)
  const m1Ref = useRef<DigitDisplayHandle>(null)
  const m2Ref = useRef<DigitDisplayHandle>(null)

  // Track previous digits to detect changes
  const prevDigitsRef = useRef<[string, string, string, string]>(['', '', '', ''])

  const [h1, h2, m1, m2] = timeToDigits(time.hours, time.minutes)
  const ss = String(time.seconds).padStart(2, '0')

  // Animate only HH:MM digits that changed
  useEffect(() => {
    const prev = prevDigitsRef.current
    const curr: [string, string, string, string] = [h1, h2, m1, m2]
    const refs = [h1Ref, h2Ref, m1Ref, m2Ref]
    const { strategy } = ALGORITHMS[algorithm]

    for (let i = 0; i < 4; i++) {
      if (curr[i] !== prev[i] && refs[i].current) {
        refs[i].current!.animateTo(curr[i], strategy, TRANSITION_DURATION)
      }
    }

    prevDigitsRef.current = curr
  }, [h1, h2, m1, m2, algorithm])

  return (
    <div className="clock-screen">
      <div className="clock-display-wrapper">
        <div className="clock-display">
          <DigitDisplay ref={h1Ref} digit={h1} clockSize={CLOCK_SIZE} gap={CLOCK_GAP} />
          <DigitDisplay ref={h2Ref} digit={h2} clockSize={CLOCK_SIZE} gap={CLOCK_GAP} />
          <ColonSeparator height={GRID_HEIGHT} />
          <DigitDisplay ref={m1Ref} digit={m1} clockSize={CLOCK_SIZE} gap={CLOCK_GAP} />
          <DigitDisplay ref={m2Ref} digit={m2} clockSize={CLOCK_SIZE} gap={CLOCK_GAP} />
        </div>
        <div className="seconds-display">
          <SevenSegment value={ss} height={60} />
        </div>
      </div>
    </div>
  )
}

export default ClockScreen
