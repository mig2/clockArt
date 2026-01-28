# Digit Patterns — Clock Hand Positions

## Grid Layout

```
┌───┬───┐
│ a │ b │  top row
├───┼───┤
│ c │ d │  middle row
├───┼───┤
│ e │ f │  bottom row
└───┴───┘
```

## Direction Angles

All angles are in degrees, clockwise from 12 o'clock:

| Direction | Angle |
|-----------|-------|
| UP        | 0     |
| RIGHT     | 90    |
| DOWN      | 180   |
| LEFT      | 270   |

## Digit Definitions

Each clock is defined as `{ hourAngleDeg, minuteAngleDeg }`.
When both hands point the same direction, they overlap (used for "blank" clocks).

---

### Digit 0

```
┌──┐
│  │
└──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 180    | RIGHT, DOWN |
| b     | 270  | 180    | LEFT, DOWN  |
| c     | 0    | 180    | UP, DOWN    |
| d     | 0    | 180    | UP, DOWN    |
| e     | 0    | 90     | UP, RIGHT   |
| f     | 0    | 270    | UP, LEFT    |

---

### Digit 1

```
   │
   │
   │
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 90     | RIGHT, RIGHT (blank) |
| b     | 180  | 180    | DOWN, DOWN  |
| c     | 90   | 90     | RIGHT, RIGHT (blank) |
| d     | 0    | 180    | UP, DOWN    |
| e     | 90   | 90     | RIGHT, RIGHT (blank) |
| f     | 0    | 0      | UP, UP      |

---

### Digit 2

```
──┐
──┘
└──
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 90     | RIGHT, RIGHT |
| b     | 270  | 180    | LEFT, DOWN   |
| c     | 90   | 180    | RIGHT, DOWN  |
| d     | 0    | 270    | UP, LEFT     |
| e     | 0    | 90     | UP, RIGHT    |
| f     | 270  | 270    | LEFT, LEFT   |

---

### Digit 3

```
──┐
──┤
──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 90     | RIGHT, RIGHT |
| b     | 270  | 180    | LEFT, DOWN   |
| c     | 90   | 90     | RIGHT, RIGHT |
| d     | 0    | 180    | UP, DOWN     |
| e     | 90   | 90     | RIGHT, RIGHT |
| f     | 0    | 270    | UP, LEFT     |

---

### Digit 4

```
│  │
└──┤
   │
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 180  | 180    | DOWN, DOWN  |
| b     | 180  | 180    | DOWN, DOWN  |
| c     | 0    | 90     | UP, RIGHT   |
| d     | 0    | 180    | UP, DOWN    |
| e     | 0    | 0      | UP, UP (blank) |
| f     | 0    | 0      | UP, UP (blank) |

---

### Digit 5

```
┌──
└──┐
──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 180    | RIGHT, DOWN |
| b     | 270  | 270    | LEFT, LEFT  |
| c     | 0    | 90     | UP, RIGHT   |
| d     | 270  | 180    | LEFT, DOWN  |
| e     | 90   | 90     | RIGHT, RIGHT |
| f     | 0    | 270    | UP, LEFT    |

---

### Digit 6

```
┌──
├──┐
└──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 180    | RIGHT, DOWN |
| b     | 270  | 270    | LEFT, LEFT  |
| c     | 0    | 90     | UP, RIGHT   |
| d     | 270  | 180    | LEFT, DOWN  |
| e     | 0    | 90     | UP, RIGHT   |
| f     | 0    | 270    | UP, LEFT    |

---

### Digit 7

```
──┐
  │
  │
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 90     | RIGHT, RIGHT |
| b     | 270  | 180    | LEFT, DOWN   |
| c     | 0    | 0      | UP, UP (blank) |
| d     | 0    | 180    | UP, DOWN     |
| e     | 0    | 0      | UP, UP (blank) |
| f     | 0    | 0      | UP, UP (blank) |

---

### Digit 8

```
┌──┐
├──┤
└──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 180    | RIGHT, DOWN |
| b     | 270  | 180    | LEFT, DOWN  |
| c     | 0    | 90     | UP, RIGHT   |
| d     | 0    | 180    | UP, DOWN    |
| e     | 0    | 90     | UP, RIGHT   |
| f     | 0    | 270    | UP, LEFT    |

Note: Clock d handles both the right vertical (UP+DOWN) and receives the middle bar from c (RIGHT). The left vertical has a visual break at the middle row since c uses its second hand for the middle bar instead of the vertical continuation.

---

### Digit 9

```
┌──┐
└──┤
──┘
```

| Clock | Hour | Minute | Description |
|-------|------|--------|-------------|
| a     | 90   | 180    | RIGHT, DOWN |
| b     | 270  | 180    | LEFT, DOWN  |
| c     | 0    | 90     | UP, RIGHT   |
| d     | 0    | 180    | UP, DOWN    |
| e     | 90   | 90     | RIGHT, RIGHT |
| f     | 0    | 270    | UP, LEFT    |

---

## JSON Summary

For programmatic use, here are all digits as arrays of `[hourAngleDeg, minuteAngleDeg]` for clocks `[a, b, c, d, e, f]`:

```json
{
  "0": [[90,180], [270,180], [0,180], [0,180], [0,90], [0,270]],
  "1": [[90,90], [180,180], [90,90], [0,180], [90,90], [0,0]],
  "2": [[90,90], [270,180], [90,180], [0,270], [0,90], [270,270]],
  "3": [[90,90], [270,180], [90,90], [0,180], [90,90], [0,270]],
  "4": [[180,180], [180,180], [0,90], [0,180], [0,0], [0,0]],
  "5": [[90,180], [270,270], [0,90], [270,180], [90,90], [0,270]],
  "6": [[90,180], [270,270], [0,90], [270,180], [0,90], [0,270]],
  "7": [[90,90], [270,180], [0,0], [0,180], [0,0], [0,0]],
  "8": [[90,180], [270,180], [0,90], [0,180], [0,90], [0,270]],
  "9": [[90,180], [270,180], [0,90], [0,180], [90,90], [0,270]]
}
```
