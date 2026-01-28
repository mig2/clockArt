import './App.css'
import AnalogClock from './components/AnalogClock/AnalogClock'
import ClockPlayground from './components/ClockPlayground/ClockPlayground'
import DigitGrid from './components/DigitGrid/DigitGrid'
import { DIGITS } from './data/digits'

// Query param modes:
//   ?grid=true         — 2x3 grid with per-clock controls
//   ?playground=true   — interactive clock playground
//   ?realtime=true     — single ticking clock
//   ?digit=X           — single digit display
//   (none)             — all digits overview
const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function App() {
  const params = new URLSearchParams(window.location.search)
  const singleDigit = params.get('digit')
  const realTimeMode = params.get('realtime') === 'true'
  const playgroundMode = params.get('playground') === 'true'
  const gridMode = params.get('grid') === 'true'

  // Grid mode: 2x3 digit grid with per-clock controls
  if (gridMode) {
    return (
      <div className="app">
        <DigitGrid />
      </div>
    )
  }

  // Playground mode: interactive clock with controls
  if (playgroundMode) {
    return (
      <div className="app">
        <ClockPlayground />
      </div>
    )
  }

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
