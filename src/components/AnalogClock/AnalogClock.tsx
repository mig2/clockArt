import './AnalogClock.css'
import { useCurrentTime } from '../../hooks/useCurrentTime'
import { useClockStyle } from '../../contexts/ClockStyleContext'

interface AnalogClockProps {
  // Time-based positioning
  hours?: number
  minutes?: number
  seconds?: number
  // Direct angle positioning (degrees clockwise from 12 o'clock)
  // When provided, these override the time-based calculation
  hourAngleDeg?: number
  minuteAngleDeg?: number
  secondAngleDeg?: number
  // Display options
  showSecondHand?: boolean
  showTickMarks?: boolean
  showCardinalTicks?: boolean
  showRegularTicks?: boolean
  size?: number | string
  // Real-time mode: when true, ignores hours/minutes/seconds props and uses live time
  realTime?: boolean
  // Color customization
  hourHandColor?: string
  minuteHandColor?: string
  secondHandColor?: string
  tickColor?: string
  faceColor?: string
  // Stroke width customization
  hourHandWidth?: number
  minuteHandWidth?: number
  secondHandWidth?: number
  faceStrokeWidth?: number
  tickStrokeWidth?: number
  cardinalTickStrokeWidth?: number
}

const VIEWBOX_SIZE = 200
const CENTER = VIEWBOX_SIZE / 2
const FACE_RADIUS = 95

// Tick geometry
const TICK_OUTER = FACE_RADIUS - 2   // just inside the circle
const TICK_INNER_CARDINAL = TICK_OUTER - 14
const TICK_INNER_REGULAR = TICK_OUTER - 8

// Hand endpoints (distance from center to tip)
const HAND_HOUR_LENGTH = 50
const HAND_MINUTE_LENGTH = 70
const HAND_SECOND_LENGTH = 78

function AnalogClock({
  hours: propHours = 0,
  minutes: propMinutes = 0,
  seconds: propSeconds = 0,
  hourAngleDeg,
  minuteAngleDeg,
  secondAngleDeg,
  showSecondHand: showSecondHandProp,
  showTickMarks: showTickMarksProp,
  showCardinalTicks: showCardinalTicksProp,
  showRegularTicks: showRegularTicksProp,
  size = '100%',
  realTime = false,
  hourHandColor: hourHandColorProp,
  minuteHandColor: minuteHandColorProp,
  secondHandColor: secondHandColorProp,
  tickColor: tickColorProp,
  faceColor: faceColorProp,
  hourHandWidth: hourHandWidthProp,
  minuteHandWidth: minuteHandWidthProp,
  secondHandWidth: secondHandWidthProp,
  faceStrokeWidth: faceStrokeWidthProp,
  tickStrokeWidth: tickStrokeWidthProp,
  cardinalTickStrokeWidth: cardinalTickStrokeWidthProp,
}: AnalogClockProps) {
  // Get current time (only used when realTime is true)
  const currentTime = useCurrentTime()

  // Global style context — props override context values
  const { style: globalStyle } = useClockStyle()
  const hourHandColor = hourHandColorProp ?? globalStyle.hourHandColor
  const minuteHandColor = minuteHandColorProp ?? globalStyle.minuteHandColor
  const secondHandColor = secondHandColorProp ?? globalStyle.secondHandColor
  const tickColor = tickColorProp ?? globalStyle.tickColor
  const faceColor = faceColorProp ?? globalStyle.faceColor
  const hourHandWidth = hourHandWidthProp ?? globalStyle.hourHandWidth
  const minuteHandWidth = minuteHandWidthProp ?? globalStyle.minuteHandWidth
  const secondHandWidth = secondHandWidthProp ?? globalStyle.secondHandWidth
  const faceStrokeWidth = faceStrokeWidthProp ?? globalStyle.faceStrokeWidth
  const tickStrokeWidth = tickStrokeWidthProp ?? globalStyle.tickStrokeWidth
  const cardinalTickStrokeWidth = cardinalTickStrokeWidthProp ?? globalStyle.cardinalTickStrokeWidth
  const showSecondHand = showSecondHandProp ?? true
  const showTickMarks = showTickMarksProp ?? globalStyle.showTickMarks
  const showCardinalTicks = showCardinalTicksProp ?? globalStyle.showCardinalTicks
  const showRegularTicks = showRegularTicksProp ?? globalStyle.showRegularTicks

  // Use real time if enabled, otherwise use props
  const hours = realTime ? currentTime.hours : propHours
  const minutes = realTime ? currentTime.minutes : propMinutes
  const seconds = realTime ? currentTime.seconds : propSeconds

  // Use direct angles if provided, otherwise compute from time
  const hourAngle = hourAngleDeg ?? ((hours % 12) * 30 + minutes * 0.5)
  const minuteAngle = minuteAngleDeg ?? (minutes * 6 + seconds * 0.1)
  const secondAngle = secondAngleDeg ?? (seconds * 6)

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const isCardinal = i % 3 === 0
    const angle = i * 30 // 360 / 12 = 30° per tick
    const radians = (angle - 90) * (Math.PI / 180) // -90 to start at 12 o'clock
    const innerRadius = isCardinal ? TICK_INNER_CARDINAL : TICK_INNER_REGULAR

    return {
      x1: CENTER + TICK_OUTER * Math.cos(radians),
      y1: CENTER + TICK_OUTER * Math.sin(radians),
      x2: CENTER + innerRadius * Math.cos(radians),
      y2: CENTER + innerRadius * Math.sin(radians),
      isCardinal,
      key: i,
    }
  })

  return (
    <svg
      className="analog-clock"
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      width={size}
      height={size}
    >
      {/* Clock face */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={FACE_RADIUS}
        className="clock-face"
        style={{ stroke: faceColor, strokeWidth: faceStrokeWidth }}
      />

      {/* Tick marks */}
      {showTickMarks &&
        ticks.map((tick) => {
          // Skip cardinal or regular ticks based on props
          if (tick.isCardinal && !showCardinalTicks) return null
          if (!tick.isCardinal && !showRegularTicks) return null
          return (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              className={tick.isCardinal ? 'tick tick-cardinal' : 'tick'}
              style={{
                stroke: tickColor,
                strokeWidth: tick.isCardinal ? cardinalTickStrokeWidth : tickStrokeWidth,
              }}
            />
          )
        })}

      {/* Hour hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - HAND_HOUR_LENGTH}
        className="hand hand-hour"
        transform={`rotate(${hourAngle}, ${CENTER}, ${CENTER})`}
        style={{ stroke: hourHandColor, strokeWidth: hourHandWidth }}
      />

      {/* Minute hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - HAND_MINUTE_LENGTH}
        className="hand hand-minute"
        transform={`rotate(${minuteAngle}, ${CENTER}, ${CENTER})`}
        style={{ stroke: minuteHandColor, strokeWidth: minuteHandWidth }}
      />

      {/* Second hand */}
      {showSecondHand && (
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER}
          y2={CENTER - HAND_SECOND_LENGTH}
          className="hand hand-second"
          transform={`rotate(${secondAngle}, ${CENTER}, ${CENTER})`}
          style={{ stroke: secondHandColor, strokeWidth: secondHandWidth }}
        />
      )}
    </svg>
  )
}

export default AnalogClock
