import { useState } from 'react'
import './App.css'
import AnalogClock from './components/AnalogClock/AnalogClock'
import ClockPlayground from './components/ClockPlayground/ClockPlayground'
import DigitGrid from './components/DigitGrid/DigitGrid'
import ClockScreen from './components/ClockScreen/ClockScreen'
import NavBar from './components/NavBar/NavBar'
import type { ViewKey } from './components/NavBar/NavBar'
import { ClockStyleProvider } from './contexts/ClockStyleContext'
import { SavedDesignsProvider } from './contexts/SavedDesignsContext'
import { DIGITS } from './data/digits'

const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Read initial view from query params for direct-link support */
function getInitialView(): ViewKey {
  const params = new URLSearchParams(window.location.search)
  if (params.get('clock') === 'true') return 'clock'
  if (params.get('grid') === 'true') return 'grid'
  if (params.get('playground') === 'true') return 'playground'
  if (params.get('realtime') === 'true') return 'realtime'
  if (params.get('gallery') === 'true') return 'gallery'
  // Also support ?digit=X as gallery view
  if (params.get('digit')) return 'gallery'
  // Default to clock
  return 'clock'
}

function App() {
  const [activeView, setActiveView] = useState<ViewKey>(getInitialView)

  return (
    <ClockStyleProvider>
      <SavedDesignsProvider>
      <div className="app">
        <NavBar activeView={activeView} onViewChange={setActiveView} />
        <div className="app-content">
          {activeView === 'clock' && <ClockScreen />}
          {activeView === 'grid' && <DigitGrid />}
          {activeView === 'playground' && <ClockPlayground />}
          {activeView === 'realtime' && (
            <div className="realtime-container">
              <AnalogClock
                size={300}
                realTime={true}
                showSecondHand={true}
                showTickMarks={true}
              />
            </div>
          )}
          {activeView === 'gallery' && (
            <div className="all-digits">
              {ALL_DIGITS.map((digit) => (
                <div key={digit} className="digit-column">
                  <div className="digit-label">{digit}</div>
                  <div className="digit-grid">
                    {DIGITS[digit].map((clock, i) => (
                      <AnalogClock
                        key={i}
                        size={80}
                        hourAngleDeg={clock.hour}
                        minuteAngleDeg={clock.minute}
                        showSecondHand={false}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </SavedDesignsProvider>
    </ClockStyleProvider>
  )
}

export default App
