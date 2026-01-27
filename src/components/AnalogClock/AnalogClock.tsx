import './AnalogClock.css'

interface AnalogClockProps {
  hours?: number
  minutes?: number
  seconds?: number
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

function AnalogClock({
  showTickMarks = true,
  size = '100%',
}: AnalogClockProps) {
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
    </svg>
  )
}

export default AnalogClock
