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

const SPEED_PRESETS = [1, 2, 5, 10, 30, 60]
const ALGORITHM_KEYS = Object.keys(ALGORITHMS) as AlgorithmKey[]

function ClockScreen() {
  const { time, setTime, setNow, speed, setSpeed } = useClockTime()
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>('shortest')

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

      {/* Controls panel */}
      <div className="clock-controls">
        <div className="clock-controls-row">
          <span className="clock-controls-label">Time</span>
          <input
            type="number"
            min={0}
            max={23}
            value={time.hours}
            onChange={(e) => setTime(Number(e.target.value), time.minutes, time.seconds)}
            className="time-input"
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={time.minutes}
            onChange={(e) => setTime(time.hours, Number(e.target.value), time.seconds)}
            className="time-input"
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={time.seconds}
            onChange={(e) => setTime(time.hours, time.minutes, Number(e.target.value))}
            className="time-input"
          />
          <button className="now-btn" onClick={setNow}>Now</button>
        </div>

        <div className="clock-controls-row">
          <span className="clock-controls-label">Algorithm</span>
          <div className="clock-btn-group">
            {ALGORITHM_KEYS.map((key) => (
              <button
                key={key}
                className={algorithm === key ? 'clock-btn active' : 'clock-btn'}
                onClick={() => setAlgorithm(key)}
              >
                {ALGORITHMS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="clock-controls-row">
          <span className="clock-controls-label">Speed</span>
          <div className="clock-btn-group">
            {SPEED_PRESETS.map((s) => (
              <button
                key={s}
                className={speed === s ? 'clock-btn active' : 'clock-btn'}
                onClick={() => setSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClockScreen
