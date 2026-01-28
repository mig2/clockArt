# Digit Transition Strategies

## Problem

When the 2×3 clock grid changes from one digit to another, an immediate snap is jarring. Since each cell is an analog clock, we can animate the transition by rotating hands from their current positions to their target positions. Different rotation strategies produce different visual effects.

## Terminology

- **Source digit**: the digit currently displayed (e.g. `1`)
- **Target digit**: the digit to transition to (e.g. `2`)
- **Hand**: an individual clock hand (hour or minute) on one of the 6 clocks (a–f)
- **Start angle**: the hand's current position in degrees (clockwise from 12 o'clock)
- **Target angle**: the hand's destination position
- **Delta**: the angular distance the hand must travel

## Worked Example: Digit 1 → Digit 2

### Source positions (Digit 1)

| Clock | Hour  | Minute | Description      |
|-------|-------|--------|------------------|
| a     | 225°  | 225°   | NEUTRAL          |
| b     | 180°  | 180°   | DOWN, DOWN       |
| c     | 225°  | 225°   | NEUTRAL          |
| d     | 0°    | 180°   | UP, DOWN         |
| e     | 225°  | 225°   | NEUTRAL          |
| f     | 0°    | 0°     | UP, UP           |

### Target positions (Digit 2)

| Clock | Hour  | Minute | Description      |
|-------|-------|--------|------------------|
| a     | 90°   | 90°    | RIGHT, RIGHT     |
| b     | 270°  | 180°   | LEFT, DOWN       |
| c     | 90°   | 180°   | RIGHT, DOWN      |
| d     | 0°    | 270°   | UP, LEFT         |
| e     | 0°    | 90°    | UP, RIGHT        |
| f     | 270°  | 270°   | LEFT, LEFT       |

---

## Strategy 1: Shortest Path Rotation

### Concept

Each hand independently rotates the shortest angular distance to reach its target. For any given start and target angle, the shortest path is whichever direction (clockwise or counterclockwise) requires ≤ 180° of rotation.

### Algorithm

```
For each hand:
  delta = targetAngle - startAngle
  Normalize delta to range (-180, +180]:
    if delta > 180:  delta -= 360
    if delta <= -180: delta += 360
  Rotate by delta over the animation duration
```

### Example: Digit 1 → Digit 2

| Clock | Hand   | Start | Target | Delta  | Direction       |
|-------|--------|-------|--------|--------|-----------------|
| a     | hour   | 225°  | 90°    | −135°  | counterclockwise |
| a     | minute | 225°  | 90°    | −135°  | counterclockwise |
| b     | hour   | 180°  | 270°   | +90°   | clockwise        |
| b     | minute | 180°  | 180°   | 0°     | no movement      |
| c     | hour   | 225°  | 90°    | −135°  | counterclockwise |
| c     | minute | 225°  | 180°   | −45°   | counterclockwise |
| d     | hour   | 0°    | 0°     | 0°     | no movement      |
| d     | minute | 180°  | 270°   | +90°   | clockwise        |
| e     | hour   | 225°  | 0°     | +135°  | clockwise        |
| e     | minute | 225°  | 90°    | −135°  | counterclockwise |
| f     | hour   | 0°    | 270°   | −90°   | counterclockwise |
| f     | minute | 0°    | 270°   | −90°   | counterclockwise |

### Characteristics

- **Duration**: Fixed (e.g. 600ms), all hands start and end together
- **Direction**: Mixed — some clockwise, some counterclockwise
- **Visual feel**: Efficient, snappy. Each hand takes the most direct route
- **Downside**: Mixed directions can look chaotic with all 12 hands moving at once

---

## Strategy 2: Synchronized Sweep

### Concept

All hands rotate in the **same direction** (clockwise) at the same duration. Every hand always goes clockwise from its start angle to its target angle. If the clockwise distance is 0° (same position), the hand doesn't move.

### Algorithm

```
For each hand:
  delta = (targetAngle - startAngle + 360) % 360
  If delta == 0: no movement
  Rotate clockwise by delta over the animation duration
```

### Example: Digit 1 → Digit 2

| Clock | Hand   | Start | Target | CW Delta | Notes              |
|-------|--------|-------|--------|----------|--------------------|
| a     | hour   | 225°  | 90°    | 225°     | ¾ turn clockwise   |
| a     | minute | 225°  | 90°    | 225°     | ¾ turn clockwise   |
| b     | hour   | 180°  | 270°   | 90°      | ¼ turn clockwise   |
| b     | minute | 180°  | 180°   | 0°       | no movement        |
| c     | hour   | 225°  | 90°    | 225°     | ¾ turn clockwise   |
| c     | minute | 225°  | 180°   | 315°     | almost full turn   |
| d     | hour   | 0°    | 0°     | 0°       | no movement        |
| d     | minute | 180°  | 270°   | 90°      | ¼ turn clockwise   |
| e     | hour   | 225°  | 0°     | 135°     | ⅜ turn clockwise   |
| e     | minute | 225°  | 90°    | 225°     | ¾ turn clockwise   |
| f     | hour   | 0°    | 270°   | 270°     | ¾ turn clockwise   |
| f     | minute | 0°    | 270°   | 270°     | ¾ turn clockwise   |

### Variant: Same speed vs. same duration

- **Same duration**: All hands start and finish together. Hands with larger deltas move faster. Looks cohesive.
- **Same speed**: All hands rotate at e.g. 360°/sec. Hands with smaller deltas finish first. Looks mechanical.

Recommend **same duration** for visual cohesion.

### Characteristics

- **Duration**: Fixed (e.g. 800ms), all hands start and end together
- **Direction**: All clockwise — uniform, predictable
- **Visual feel**: Mechanical, clock-like. Evokes physical clock display. The whole grid "sweeps" together
- **Downside**: Some hands take the long way round (e.g. clock c minute: 315° clockwise instead of 45° counterclockwise)

---

## Strategy 3: Staggered / Sequential

### Concept

Instead of animating all clocks simultaneously, animate them in a sequence — one at a time, row by row, or column by column. Each clock's hands use shortest-path rotation, but the clocks are staggered in time.

### Ordering Options

| Order        | Sequence            | Feel                  |
|--------------|---------------------|-----------------------|
| Row by row   | ab → cd → ef        | Top-down cascade      |
| Column by col| ace → bdf           | Left-then-right wipe  |
| Spiral       | a → b → d → f → e → c | Rotational sweep   |
| Random       | randomized order    | Playful, organic      |

### Algorithm (row by row example)

```
stagger_delay = animation_duration / 3  (e.g. 200ms if total is 600ms)

For each row [ab, cd, ef] at index r:
  wait(r * stagger_delay)
  For each hand in this row's clocks:
    Rotate via shortest path over animation_duration
```

### Example: Digit 1 → Digit 2 (row by row, 200ms stagger, 400ms per clock)

| Time    | Action                                                |
|---------|-------------------------------------------------------|
| 0ms     | Clocks a, b start rotating (shortest path)            |
| 200ms   | Clocks c, d start rotating                            |
| 400ms   | Clocks a, b finish; clocks e, f start rotating        |
| 600ms   | Clocks c, d finish                                    |
| 800ms   | Clocks e, f finish — transition complete              |

### Characteristics

- **Duration**: Longer overall (stagger adds time), e.g. 800ms total
- **Direction**: Shortest path per hand (mixed), but only a few clocks move at once
- **Visual feel**: Deliberate, readable. You can follow the transformation step by step
- **Downside**: Slower. May feel sluggish for second-by-second digit changes

---

## Comparison Summary

| Property              | Shortest Path       | Synchronized Sweep     | Staggered            |
|-----------------------|---------------------|------------------------|----------------------|
| Hand direction        | Mixed (CW/CCW)      | All clockwise          | Mixed (CW/CCW)       |
| Simultaneous hands    | All 12 at once      | All 12 at once         | 2–4 at a time        |
| Total duration        | ~600ms              | ~800ms                 | ~800ms               |
| Visual cohesion       | Medium              | High                   | Medium               |
| Readability           | Low (busy)          | Medium                 | High (sequential)    |
| Mechanical feel       | Low                 | High                   | Medium               |
| Ease of implementation| Simple              | Simple                 | Moderate             |

---

## Implementation Notes

### CSS Transition Approach

The simplest implementation uses CSS `transition` on the SVG `transform: rotate()` property. However, CSS transitions take the shortest path by default and don't support "always clockwise" — they interpolate between angles.

### JavaScript Animation Approach

For full control (especially synchronized sweep), use `requestAnimationFrame` with explicit angle interpolation:

```typescript
function animateHand(
  startAngle: number,
  targetAngle: number,
  duration: number,
  direction: 'shortest' | 'clockwise',
  onUpdate: (angle: number) => void,
  onComplete: () => void,
) {
  let delta: number
  if (direction === 'clockwise') {
    delta = (targetAngle - startAngle + 360) % 360
  } else {
    delta = targetAngle - startAngle
    if (delta > 180) delta -= 360
    if (delta <= -180) delta += 360
  }

  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(t)
    const currentAngle = (startAngle + delta * eased) % 360
    onUpdate(currentAngle < 0 ? currentAngle + 360 : currentAngle)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onComplete()
    }
  }

  requestAnimationFrame(tick)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}
```

### Easing

All strategies benefit from easing rather than linear interpolation. `easeInOutCubic` gives a natural acceleration/deceleration that mimics physical clock hand movement.
