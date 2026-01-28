import './AnalogClock.css'

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
  size?: number | string
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
  hours = 0,
  minutes = 0,
  seconds = 0,
  hourAngleDeg,
  minuteAngleDeg,
  secondAngleDeg,
  showSecondHand = true,
  showTickMarks = true,
  size = '100%',
}: AnalogClockProps) {
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
      />

      {/* Tick marks */}
      {showTickMarks &&
        ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            className={tick.isCardinal ? 'tick tick-cardinal' : 'tick'}
          />
        ))}

      {/* Hour hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - HAND_HOUR_LENGTH}
        className="hand hand-hour"
        transform={`rotate(${hourAngle}, ${CENTER}, ${CENTER})`}
      />

      {/* Minute hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - HAND_MINUTE_LENGTH}
        className="hand hand-minute"
        transform={`rotate(${minuteAngle}, ${CENTER}, ${CENTER})`}
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
        />
      )}
    </svg>
  )
}

export default AnalogClock
