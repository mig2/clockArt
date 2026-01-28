import { useState } from 'react'
import AnalogClock from '../AnalogClock/AnalogClock'
import './ClockPlayground.css'

type PositionMode = 'angle' | 'time'

interface PlaygroundState {
  // Position mode
  positionMode: PositionMode
  // Angle mode values
  hourAngle: number
  minuteAngle: number
  secondAngle: number
  // Time mode values
  hours: number
  minutes: number
  seconds: number
  // Display toggles
  showSecondHand: boolean
  showTickMarks: boolean
  showCardinalTicks: boolean
  showRegularTicks: boolean
  // Colors
  hourHandColor: string
  minuteHandColor: string
  secondHandColor: string
  tickColor: string
  faceColor: string
}

const DEFAULT_STATE: PlaygroundState = {
  positionMode: 'angle',
  hourAngle: 0,
  minuteAngle: 0,
  secondAngle: 0,
  hours: 10,
  minutes: 10,
  seconds: 30,
  showSecondHand: true,
  showTickMarks: true,
  showCardinalTicks: true,
  showRegularTicks: true,
  hourHandColor: '#333333',
  minuteHandColor: '#333333',
  secondHandColor: '#e74c3c',
  tickColor: '#333333',
  faceColor: '#333333',
}

function ClockPlayground() {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE)

  const update = <K extends keyof PlaygroundState>(key: K, value: PlaygroundState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Build clock props based on position mode
  const clockProps =
    state.positionMode === 'angle'
      ? {
          hourAngleDeg: state.hourAngle,
          minuteAngleDeg: state.minuteAngle,
          secondAngleDeg: state.secondAngle,
        }
      : {
          hours: state.hours,
          minutes: state.minutes,
          seconds: state.seconds,
        }

  return (
    <div className="playground">
      {/* Clock preview */}
      <div className="playground-preview">
        <AnalogClock
          size={300}
          {...clockProps}
          showSecondHand={state.showSecondHand}
          showTickMarks={state.showTickMarks}
          showCardinalTicks={state.showCardinalTicks}
          showRegularTicks={state.showRegularTicks}
          hourHandColor={state.hourHandColor}
          minuteHandColor={state.minuteHandColor}
          secondHandColor={state.secondHandColor}
          tickColor={state.tickColor}
          faceColor={state.faceColor}
        />
      </div>

      {/* Controls */}
      <div className="playground-controls">
        {/* Position mode */}
        <fieldset className="control-group">
          <legend>Hand Position</legend>

          <div className="control-row">
            <label>Mode</label>
            <div className="toggle-group">
              <button
                className={state.positionMode === 'angle' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => update('positionMode', 'angle')}
              >
                Angle (°)
              </button>
              <button
                className={state.positionMode === 'time' ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => update('positionMode', 'time')}
              >
                Time
              </button>
            </div>
          </div>

          {state.positionMode === 'angle' ? (
            <>
              <SliderControl
                label="Hour hand"
                value={state.hourAngle}
                min={0}
                max={360}
                unit="°"
                onChange={(v) => update('hourAngle', v)}
              />
              <SliderControl
                label="Minute hand"
                value={state.minuteAngle}
                min={0}
                max={360}
                unit="°"
                onChange={(v) => update('minuteAngle', v)}
              />
              <SliderControl
                label="Second hand"
                value={state.secondAngle}
                min={0}
                max={360}
                unit="°"
                onChange={(v) => update('secondAngle', v)}
              />
            </>
          ) : (
            <>
              <SliderControl
                label="Hours"
                value={state.hours}
                min={0}
                max={23}
                onChange={(v) => update('hours', v)}
              />
              <SliderControl
                label="Minutes"
                value={state.minutes}
                min={0}
                max={59}
                onChange={(v) => update('minutes', v)}
              />
              <SliderControl
                label="Seconds"
                value={state.seconds}
                min={0}
                max={59}
                onChange={(v) => update('seconds', v)}
              />
            </>
          )}
        </fieldset>

        {/* Display toggles */}
        <fieldset className="control-group">
          <legend>Display</legend>
          <ToggleControl
            label="Second hand"
            checked={state.showSecondHand}
            onChange={(v) => update('showSecondHand', v)}
          />
          <ToggleControl
            label="Tick marks"
            checked={state.showTickMarks}
            onChange={(v) => update('showTickMarks', v)}
          />
          {state.showTickMarks && (
            <>
              <ToggleControl
                label="Cardinal ticks (12, 3, 6, 9)"
                checked={state.showCardinalTicks}
                onChange={(v) => update('showCardinalTicks', v)}
              />
              <ToggleControl
                label="Regular ticks"
                checked={state.showRegularTicks}
                onChange={(v) => update('showRegularTicks', v)}
              />
            </>
          )}
        </fieldset>

        {/* Colors */}
        <fieldset className="control-group">
          <legend>Colors</legend>
          <ColorControl
            label="Hour hand"
            value={state.hourHandColor}
            onChange={(v) => update('hourHandColor', v)}
          />
          <ColorControl
            label="Minute hand"
            value={state.minuteHandColor}
            onChange={(v) => update('minuteHandColor', v)}
          />
          <ColorControl
            label="Second hand"
            value={state.secondHandColor}
            onChange={(v) => update('secondHandColor', v)}
          />
          <ColorControl
            label="Tick marks"
            value={state.tickColor}
            onChange={(v) => update('tickColor', v)}
          />
          <ColorControl
            label="Clock face"
            value={state.faceColor}
            onChange={(v) => update('faceColor', v)}
          />
        </fieldset>

        {/* Reset */}
        <button className="reset-btn" onClick={() => setState(DEFAULT_STATE)}>
          Reset All
        </button>
      </div>
    </div>
  )
}

// --- Sub-components for controls ---

function SliderControl({
  label,
  value,
  min,
  max,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="control-row">
      <label>{label}</label>
      <div className="slider-group">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (v >= min && v <= max) onChange(v)
          }}
          className="number-input"
        />
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  )
}

function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="control-row">
      <label>{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="control-row">
      <label>{label}</label>
      <div className="color-group">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-text-input"
        />
      </div>
    </div>
  )
}

export default ClockPlayground
