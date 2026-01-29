import './SevenSegment.css'

/**
 * 7-segment digit layout:
 *
 *   ─ a ─
 *  │     │
 *  f     b
 *  │     │
 *   ─ g ─
 *  │     │
 *  e     c
 *  │     │
 *   ─ d ─
 *
 * Segments indexed: a=0, b=1, c=2, d=3, e=4, f=5, g=6
 */

// Which segments are ON for each digit (true = lit)
const SEGMENT_MAP: Record<string, boolean[]> = {
  //        a      b      c      d      e      f      g
  '0': [ true,  true,  true,  true,  true,  true,  false],
  '1': [false,  true,  true, false, false, false, false],
  '2': [ true,  true, false,  true,  true, false,  true],
  '3': [ true,  true,  true,  true, false, false,  true],
  '4': [false,  true,  true, false, false,  true,  true],
  '5': [ true, false,  true,  true, false,  true,  true],
  '6': [ true, false,  true,  true,  true,  true,  true],
  '7': [ true,  true,  true, false, false, false, false],
  '8': [ true,  true,  true,  true,  true,  true,  true],
  '9': [ true,  true,  true,  true, false,  true,  true],
}

/** Renders a single 7-segment digit as SVG */
function SevenSegmentDigit({ digit, width, height }: { digit: string; width: number; height: number }) {
  const segments = SEGMENT_MAP[digit] || SEGMENT_MAP['0']
  const sw = 3 // segment thickness
  const pad = 1 // padding from edge
  const hMid = height / 2

  // Segment paths as [x1, y1, x2, y2] for simplified lines
  const segmentLines: [number, number, number, number][] = [
    // a: top horizontal
    [pad + sw, pad, width - pad - sw, pad],
    // b: top-right vertical
    [width - pad, pad + sw, width - pad, hMid - sw / 2],
    // c: bottom-right vertical
    [width - pad, hMid + sw / 2, width - pad, height - pad - sw],
    // d: bottom horizontal
    [pad + sw, height - pad, width - pad - sw, height - pad],
    // e: bottom-left vertical
    [pad, hMid + sw / 2, pad, height - pad - sw],
    // f: top-left vertical
    [pad, pad + sw, pad, hMid - sw / 2],
    // g: middle horizontal
    [pad + sw, hMid, width - pad - sw, hMid],
  ]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="seven-segment-digit"
    >
      {segmentLines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={sw}
          strokeLinecap="round"
          className={segments[i] ? 'seg-on' : 'seg-off'}
        />
      ))}
    </svg>
  )
}

interface SevenSegmentProps {
  /** The string to display (e.g. "42") — each character is rendered as a digit */
  value: string
  /** Height of each digit in px */
  height?: number
}

/**
 * A multi-digit 7-segment display.
 * Renders each character of `value` as an individual SVG 7-segment digit.
 */
function SevenSegment({ value, height = 48 }: SevenSegmentProps) {
  const digitWidth = Math.round(height * 0.55)

  return (
    <div className="seven-segment" style={{ gap: Math.round(height * 0.08) }}>
      {value.split('').map((ch, i) => (
        <SevenSegmentDigit key={i} digit={ch} width={digitWidth} height={height} />
      ))}
    </div>
  )
}

export default SevenSegment
