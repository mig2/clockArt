import { useState, useCallback } from 'react'
import AnalogClock from '../AnalogClock/AnalogClock'
import { DIGITS, CLOCK_LABELS } from '../../data/digits'
import { useDigitTransition } from '../../hooks/useDigitTransition'
import {
  shortestPathStrategy,
  synchronizedSweepStrategy,
  staggeredStrategy,
} from '../../animation'
import type { DigitAngles, TransitionStrategy } from '../../animation'
import './DigitGrid.css'

type PositionMode = 'angle' | 'time'

interface ClockState {
  mode: PositionMode
  hourAngle: number
  minuteAngle: number
  hours: number
  minutes: number
}

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type SelectedDigit = Digit | 'custom'

const DIGIT_LIST: Digit[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

type AlgorithmKey = 'shortest' | 'sweep' | 'staggered'

const ALGORITHMS: Record<AlgorithmKey, { label: string; strategy: TransitionStrategy }> = {
  shortest: { label: 'Shortest Path', strategy: shortestPathStrategy },
  sweep: { label: 'Synchronized Sweep', strategy: synchronizedSweepStrategy },
  staggered: { label: 'Staggered', strategy: staggeredStrategy },
}

/** Convert a digit pattern to DigitAngles format */
function digitToAngles(digit: string): DigitAngles {
  const pattern = DIGITS[digit]
  if (!pattern) return Array(6).fill({ hour: 0, minute: 0 })
  return pattern.map((c) => ({ hour: c.hour, minute: c.minute }))
}

/** Convert a digit pattern to ClockState[] for the per-clock controls */
function clocksFromDigit(digit: string): ClockState[] {
  const pattern = DIGITS[digit]
  if (!pattern) return Array(6).fill({ mode: 'angle', hourAngle: 0, minuteAngle: 0, hours: 0, minutes: 0 })
  return pattern.map((c) => ({
    mode: 'angle' as PositionMode,
    hourAngle: c.hour,
    minuteAngle: c.minute,
    hours: 0,
    minutes: 0,
  }))
}

function DigitGrid() {
  // --- Per-clock manual controls state (existing feature) ---
  const [selectedDigit, setSelectedDigit] = useState<SelectedDigit>('0')
  const [clocks, setClocks] = useState<ClockState[]>(() => clocksFromDigit('0'))

  // --- Transition animation state ---
  const [fromDigit, setFromDigit] = useState<Digit>('1')
  const [toDigit, setToDigit] = useState<Digit>('2')
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>('shortest')
  const [duration, setDuration] = useState(800)

  const transition = useDigitTransition(digitToAngles('0'))

  // --- Handlers ---

  function handleDigitSelect(digit: SelectedDigit) {
    if (transition.isAnimating) return
    setSelectedDigit(digit)
    if (digit !== 'custom') {
      setClocks(clocksFromDigit(digit))
      transition.setAngles(digitToAngles(digit))
    }
  }

  function updateClock(index: number, updates: Partial<ClockState>) {
    if (transition.isAnimating) return
    setClocks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    )
    if (selectedDigit !== 'custom') {
      setSelectedDigit('custom')
    }
  }

  const handlePlay = useCallback(() => {
    if (transition.isAnimating) return
    const from = digitToAngles(fromDigit)
    const to = digitToAngles(toDigit)
    const { strategy } = ALGORITHMS[algorithm]

    // Set grid to show source digit first
    setSelectedDigit(fromDigit)
    setClocks(clocksFromDigit(fromDigit))
    transition.setAngles(from)

    // Start animation on next frame so the "from" state renders first
    requestAnimationFrame(() => {
      transition.animateTo(to, strategy, duration)
    })

    // After animation, update the manual controls to reflect the target
    setTimeout(() => {
      setSelectedDigit(toDigit)
      setClocks(clocksFromDigit(toDigit))
    }, duration + 50)
  }, [fromDigit, toDigit, algorithm, duration, transition])

  // --- Determine which angles to show ---
  // During animation: use transition.angles
  // Otherwise: use manual clock states
  function getClockProps(index: number) {
    if (transition.isAnimating) {
      const a = transition.angles[index]
      return {
        hourAngleDeg: a.hour,
        minuteAngleDeg: a.minute,
      }
    }
    const clock = clocks[index]
    if (clock.mode === 'angle') {
      return {
        hourAngleDeg: clock.hourAngle,
        minuteAngleDeg: clock.minuteAngle,
      }
    }
    return {
      hours: clock.hours,
      minutes: clock.minutes,
    }
  }

  const isCustom = selectedDigit === 'custom'

  return (
    <div className="digit-grid-page">
      {/* Transition controls */}
      <div className="transition-controls">
        <div className="transition-row">
          <span className="transition-label">From</span>
          <div className="digit-buttons compact">
            {DIGIT_LIST.map((d) => (
              <button
                key={d}
                className={fromDigit === d ? 'digit-btn active' : 'digit-btn'}
                onClick={() => setFromDigit(d)}
                disabled={transition.isAnimating}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="transition-row">
          <span className="transition-label">To</span>
          <div className="digit-buttons compact">
            {DIGIT_LIST.map((d) => (
              <button
                key={d}
                className={toDigit === d ? 'digit-btn active' : 'digit-btn'}
                onClick={() => setToDigit(d)}
                disabled={transition.isAnimating}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="transition-row">
          <span className="transition-label">Algorithm</span>
          <div className="digit-buttons compact">
            {(Object.keys(ALGORITHMS) as AlgorithmKey[]).map((key) => (
              <button
                key={key}
                className={algorithm === key ? 'digit-btn active' : 'digit-btn'}
                onClick={() => setAlgorithm(key)}
                disabled={transition.isAnimating}
              >
                {ALGORITHMS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="transition-row">
          <span className="transition-label">Duration</span>
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={transition.isAnimating}
          />
          <span className="duration-value">{duration}ms</span>
        </div>

        <div className="transition-row">
          <button
            className="play-btn"
            onClick={handlePlay}
            disabled={transition.isAnimating}
          >
            {transition.isAnimating ? 'Playing…' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* Digit preset selector */}
      <div className="digit-selector">
        <span className="digit-selector-label">Digit:</span>
        <div className="digit-buttons">
          {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'custom'].map((d) => (
            <button
              key={d}
              className={selectedDigit === d ? 'digit-btn active' : 'digit-btn'}
              onClick={() => handleDigitSelect(d as SelectedDigit)}
              disabled={transition.isAnimating}
            >
              {d === 'custom' ? '✎' : d}
            </button>
          ))}
        </div>
      </div>

      <div className="digit-grid-layout">
        {/* Grid preview */}
        <div className="digit-grid-preview">
          <div className="digit-grid">
            {clocks.map((_, i) => (
              <div key={i} className="grid-cell">
                <div className="grid-cell-label">{CLOCK_LABELS[i]}</div>
                <AnalogClock
                  size={100}
                  {...getClockProps(i)}
                  showSecondHand={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Per-clock controls */}
        <div className="clock-controls-panel">
          <h3 className="controls-heading">
            {isCustom ? 'Per-Clock Controls' : `Digit ${selectedDigit} — Edit to customize`}
          </h3>
          {clocks.map((clock, i) => (
            <ClockControl
              key={i}
              label={CLOCK_LABELS[i]}
              state={clock}
              onChange={(updates) => updateClock(i, updates)}
              disabled={transition.isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Per-clock control sub-component ---

function ClockControl({
  label,
  state,
  onChange,
  disabled = false,
}: {
  label: string
  state: ClockState
  onChange: (updates: Partial<ClockState>) => void
  disabled?: boolean
}) {
  return (
    <fieldset className="clock-control" disabled={disabled}>
      <legend>Clock {label}</legend>
      <div className="clock-control-row">
        <div className="mode-toggle">
          <button
            className={state.mode === 'angle' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => onChange({ mode: 'angle' })}
          >
            Angle
          </button>
          <button
            className={state.mode === 'time' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => onChange({ mode: 'time' })}
          >
            Time
          </button>
        </div>

        {state.mode === 'angle' ? (
          <div className="clock-inputs">
            <label>
              H°
              <input
                type="range"
                min={0}
                max={360}
                value={state.hourAngle}
                onChange={(e) => onChange({ hourAngle: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                max={360}
                value={state.hourAngle}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (v >= 0 && v <= 360) onChange({ hourAngle: v })
                }}
                className="num-input"
              />
            </label>
            <label>
              M°
              <input
                type="range"
                min={0}
                max={360}
                value={state.minuteAngle}
                onChange={(e) => onChange({ minuteAngle: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                max={360}
                value={state.minuteAngle}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (v >= 0 && v <= 360) onChange({ minuteAngle: v })
                }}
                className="num-input"
              />
            </label>
          </div>
        ) : (
          <div className="clock-inputs">
            <label>
              Hr
              <input
                type="number"
                min={0}
                max={11}
                value={state.hours}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (v >= 0 && v <= 11) onChange({ hours: v })
                }}
                className="num-input"
              />
            </label>
            <label>
              Min
              <input
                type="number"
                min={0}
                max={59}
                value={state.minutes}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (v >= 0 && v <= 59) onChange({ minutes: v })
                }}
                className="num-input"
              />
            </label>
          </div>
        )}
      </div>
    </fieldset>
  )
}

export default DigitGrid
