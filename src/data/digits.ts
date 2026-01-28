// Direction angles (degrees clockwise from 12 o'clock)
export const UP = 0
export const RIGHT = 90
export const DOWN = 180
export const LEFT = 270

// "Neutral" angles for unused clocks — both hands at 225° (7:30 position)
export const NEUTRAL_HOUR = 225
export const NEUTRAL_MINUTE = 225

// Clock labels in grid order
export const CLOCK_LABELS = ['a', 'b', 'c', 'd', 'e', 'f'] as const

// Each digit: array of 6 clocks [a, b, c, d, e, f]
// Each clock: { hour: angle, minute: angle }
export const DIGITS: Record<string, { hour: number; minute: number }[]> = {
  // 0: box shape — top bar, left+right verticals, bottom bar
  //   ┌──┐
  //   │  │
  //   └──┘
  '0': [
    { hour: RIGHT, minute: DOWN  }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: UP,    minute: DOWN  }, { hour: UP,    minute: DOWN  },  // c, d
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],

  // 1: right column vertical only — left column is neutral/unused
  //      │
  //      │
  //      │
  '1': [
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: DOWN,  minute: DOWN  },  // a (neutral), b
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: UP,    minute: DOWN  },  // c (neutral), d
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: UP,    minute: UP    },  // e (neutral), f
  ],

  // 2: top bar, right vertical top, middle bar, left vertical bottom, bottom bar
  //   ──┐
  //   ──┘
  //   └──
  '2': [
    { hour: RIGHT, minute: RIGHT }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: RIGHT, minute: DOWN  }, { hour: UP,    minute: LEFT  },  // c, d
    { hour: UP,    minute: RIGHT }, { hour: LEFT,  minute: LEFT  },  // e, f
  ],

  // 3: three horizontal bars, right vertical
  //   ──┐
  //   ──┤
  //   ──┘
  '3': [
    { hour: RIGHT, minute: RIGHT }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: RIGHT, minute: RIGHT }, { hour: UP,    minute: DOWN  },  // c, d
    { hour: RIGHT, minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],

  // 4: top verticals both sides, middle bar, right vertical bottom — e is neutral
  //   │  │
  //   └──┤
  //      │
  '4': [
    { hour: DOWN,  minute: DOWN  }, { hour: DOWN,  minute: DOWN  },  // a, b
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: DOWN  },  // c, d
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: UP,    minute: UP    },  // e (neutral), f
  ],

  // 5: top bar, left vertical top, middle bar, right vertical bottom, bottom bar
  //   ┌──
  //   └──┐
  //   ──┘
  '5': [
    { hour: RIGHT, minute: DOWN  }, { hour: LEFT,  minute: LEFT  },  // a, b
    { hour: UP,    minute: RIGHT }, { hour: LEFT,  minute: DOWN  },  // c, d
    { hour: RIGHT, minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],

  // 6: top bar, left vertical, middle bar, both verticals bottom, bottom bar
  //   ┌──
  //   ├──┐
  //   └──┘
  '6': [
    { hour: RIGHT, minute: DOWN  }, { hour: LEFT,  minute: LEFT  },  // a, b
    { hour: UP,    minute: RIGHT }, { hour: LEFT,  minute: DOWN  },  // c, d
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],

  // 7: top bar, right vertical — left column (except a) is neutral
  //   ──┐
  //     │
  //     │
  '7': [
    { hour: RIGHT, minute: RIGHT }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: UP,    minute: DOWN  },  // c (neutral), d
    { hour: NEUTRAL_HOUR, minute: NEUTRAL_MINUTE }, { hour: UP,    minute: UP    },  // e (neutral), f
  ],

  // 8: all bars and all verticals — full box with middle bar
  //   ┌──┐
  //   ├──┤
  //   └──┘
  '8': [
    { hour: RIGHT, minute: DOWN  }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: DOWN  },  // c, d
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],

  // 9: top bar, both verticals top, middle bar, right vertical bottom, bottom bar
  //   ┌──┐
  //   └──┤
  //   ──┘
  '9': [
    { hour: RIGHT, minute: DOWN  }, { hour: LEFT,  minute: DOWN  },  // a, b
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: DOWN  },  // c, d
    { hour: RIGHT, minute: RIGHT }, { hour: UP,    minute: LEFT  },  // e, f
  ],
}
