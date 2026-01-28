import { useState } from 'react'
import AnalogClock from '../AnalogClock/AnalogClock'
import { DIGITS, CLOCK_LABELS } from '../../data/digits'
import './DigitGrid.css'

type PositionMode = 'angle' | 'time'

interface ClockState {
  mode: PositionMode
  // Angle mode
  hourAngle: number
  minuteAngle: number
  // Time mode
  hours: number
  minutes: number
}

const DEFAULT_CLOCK: ClockState = {
  mode: 'angle',
  hourAngle: 0,
  minuteAngle: 0,
  hours: 0,
  minutes: 0,
}

type SelectedDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'custom'

function DigitGrid() {
  const [selectedDigit, setSelectedDigit] = useState<SelectedDigit>('0')
  const [clocks, setClocks] = useState<ClockState[]>(
    () => clocksFromDigit('0')
  )

  function clocksFromDigit(digit: string): ClockState[] {
    const pattern = DIGITS[digit]
    if (!pattern) return Array(6).fill(DEFAULT_CLOCK)
    return pattern.map((c) => ({
      mode: 'angle' as PositionMode,
      hourAngle: c.hour,
      minuteAngle: c.minute,
      hours: 0,
      minutes: 0,
    }))
  }

  function handleDigitSelect(digit: SelectedDigit) {
    setSelectedDigit(digit)
    if (digit !== 'custom') {
      setClocks(clocksFromDigit(digit))
    }
  }

  function updateClock(index: number, updates: Partial<ClockState>) {
    setClocks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    )
    // Switch to custom when user manually edits
    if (selectedDigit !== 'custom') {
      setSelectedDigit('custom')
    }
  }

  // Compute props for each clock
  function clockProps(state: ClockState) {
    if (state.mode === 'angle') {
      return {
        hourAngleDeg: state.hourAngle,
        minuteAngleDeg: state.minuteAngle,
      }
    }
    return {
      hours: state.hours,
      minutes: state.minutes,
    }
  }

  const isCustom = selectedDigit === 'custom'

  return (
    <div className="digit-grid-page">
      {/* Digit preset selector */}
      <div className="digit-selector">
        <span className="digit-selector-label">Digit:</span>
        <div className="digit-buttons">
          {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'custom'].map((d) => (
            <button
              key={d}
              className={selectedDigit === d ? 'digit-btn active' : 'digit-btn'}
              onClick={() => handleDigitSelect(d as SelectedDigit)}
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
            {clocks.map((clock, i) => (
              <div key={i} className="grid-cell">
                <div className="grid-cell-label">{CLOCK_LABELS[i]}</div>
                <AnalogClock
                  size={100}
                  {...clockProps(clock)}
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
}: {
  label: string
  state: ClockState
  onChange: (updates: Partial<ClockState>) => void
}) {
  return (
    <fieldset className="clock-control">
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
