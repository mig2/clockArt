# Analog Clock Component Design

**Date:** 2025-01-27
**Status:** Draft

## Purpose

Build a single reusable `<AnalogClock>` SVG component as the foundational building block for clockArt — a project that renders digital clock digits using grids of analog clock faces.

## Context

Each digit on the eventual digital clock display will be composed of a 2x3 grid (2 horizontal, 3 vertical) of analog clocks. The hands of each analog clock will be positioned to collectively form the shape of a digit (0-9). This design document covers the first step: a standalone, resizable analog clock component.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React + TypeScript | Component model ideal for reusing clocks across digit grids |
| Build | Vite | Zero-config, fast HMR |
| Rendering | SVG | Resolution-independent, CSS-transformable hands, scales cleanly |
| Styling | CSS Modules or plain CSS | No UI framework needed — all custom visual work |

### Why SVG over Canvas?

Each clock is a discrete, styleable DOM element. SVG gives us:
- Native scaling via `viewBox`
- CSS transforms for hand rotation
- Easy hit-testing and accessibility
- No pixel-density management

Canvas would be better for hundreds of clocks animating at 60fps, but for our grid sizes SVG is simpler and sufficient.

## Component: `<AnalogClock>`

### Visual Design

**Aesthetic:** Minimal / modern

- Circular face with thin border stroke
- 12 tick marks around the perimeter:
  - **Cardinal positions** (12, 3, 6, 9): slightly longer and thicker
  - **Other hours**: shorter, thinner
- Three hands from center:
  - **Hour hand**: shortest, thickest
  - **Minute hand**: longer, medium thickness
  - **Second hand**: longest, thinnest, subtle accent color (e.g., red)
- No numbers, no center cap, no background fill
- Transparent or white circle background

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hours` | `number` | `0` | Hour hand position (0-11, fractional ok) |
| `minutes` | `number` | `0` | Minute hand position (0-59, fractional ok) |
| `seconds` | `number` | `0` | Second hand position (0-59, fractional ok) |
| `showSecondHand` | `boolean` | `true` | Whether to render the second hand |
| `showTickMarks` | `boolean` | `true` | Whether to render hour tick marks |
| `size` | `number \| string` | `'100%'` | Width/height of the rendered SVG |

### SVG Structure

```
<svg viewBox="0 0 200 200">
  <!-- Face -->
  <circle cx="100" cy="100" r="95" stroke="#333" fill="none" />

  <!-- Tick marks (12x, rotated) -->
  <line ... /> <!-- cardinal: longer/thicker -->
  <line ... /> <!-- non-cardinal: shorter/thinner -->

  <!-- Hour hand -->
  <line x1="100" y1="100" x2="100" y2="45"
        transform="rotate({hourAngle}, 100, 100)" />

  <!-- Minute hand -->
  <line x1="100" y1="100" x2="100" y2="25"
        transform="rotate({minuteAngle}, 100, 100)" />

  <!-- Second hand (conditional) -->
  <line x1="100" y1="100" x2="100" y2="15"
        transform="rotate({secondAngle}, 100, 100)"
        stroke="red" />
</svg>
```

### Hand Angle Calculation

- **Hour**: `(hours % 12) * 30 + minutes * 0.5` degrees
- **Minute**: `minutes * 6 + seconds * 0.1` degrees
- **Second**: `seconds * 6` degrees

All rotations are clockwise from 12 o'clock (0° = straight up).

### Page Layout (Phase 1)

- Single `<AnalogClock>` centered on page
- Default size ~300px, but responsive to container
- Centered both horizontally and vertically using flexbox

## Future Considerations

- Hand positions will be driven programmatically (not real-time) for digit formation
- Component must remain performant when rendered 6+ times per digit
- May need animation/transition support for hands moving between positions
- Color theming for light/dark modes
