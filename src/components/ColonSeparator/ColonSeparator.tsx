import './ColonSeparator.css'

interface ColonSeparatorProps {
  /** Total height to match the digit grid (px) */
  height: number
  /** Dot diameter as a fraction of height (default 0.06) */
  dotScale?: number
}

/**
 * A colon separator (:) rendered as two vertically-centered dots.
 * Sized proportionally to match adjacent digit grids.
 */
function ColonSeparator({ height, dotScale = 0.06 }: ColonSeparatorProps) {
  const dotSize = Math.max(6, Math.round(height * dotScale))
  // Space the dots at 1/3 and 2/3 of the height
  const spacing = Math.round(height * 0.2)

  return (
    <div className="colon-separator" style={{ height }}>
      <div
        className="colon-dot"
        style={{
          width: dotSize,
          height: dotSize,
          marginBottom: spacing,
        }}
      />
      <div
        className="colon-dot"
        style={{
          width: dotSize,
          height: dotSize,
        }}
      />
    </div>
  )
}

export default ColonSeparator
