import './App.css'
import AnalogClock from './components/AnalogClock/AnalogClock'

// Direction angles (degrees clockwise from 12 o'clock)
const UP = 0
const RIGHT = 90
const DOWN = 180
const LEFT = 270

// "Neutral" angles for unused clocks — both hands at 225° (7:30 position)
const NEUTRAL_HOUR = 225
const NEUTRAL_MINUTE = 225

// Each digit: array of 6 clocks [a, b, c, d, e, f]
// Each clock: { hour: angle, minute: angle }
const DIGITS: Record<string, { hour: number; minute: number }[]> = {
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
    { hour: UP,    minute: RIGHT }, { hour: UP,    minute: DOWN  },  // c, d (c: up+right, d: up+down — middle bar from c→d implied by RIGHT, vertical continues)
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

// Show all digits or a single digit via ?digit=X query param
// Use ?realtime=true to show a single ticking clock
const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function App() {
  const params = new URLSearchParams(window.location.search)
  const singleDigit = params.get('digit')
  const realTimeMode = params.get('realtime') === 'true'

  // Real-time clock mode: show a single ticking clock
  if (realTimeMode) {
    return (
      <div className="app">
        <div className="realtime-container">
          <AnalogClock
            size={300}
            realTime={true}
            showSecondHand={true}
            showTickMarks={true}
          />
        </div>
      </div>
    )
  }

  const digitsToShow = singleDigit && DIGITS[singleDigit] ? [singleDigit] : ALL_DIGITS

  return (
    <div className="app">
      <div className={singleDigit ? 'single-digit' : 'all-digits'}>
        {digitsToShow.map((digit) => (
          <div key={digit} className="digit-column">
            {!singleDigit && <div className="digit-label">{digit}</div>}
            <div className="digit-grid">
              {DIGITS[digit].map((clock, i) => (
                <AnalogClock
                  key={i}
                  size={singleDigit ? 120 : 80}
                  hourAngleDeg={clock.hour}
                  minuteAngleDeg={clock.minute}
                  showSecondHand={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
