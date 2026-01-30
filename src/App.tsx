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
import { DigitDesignProvider } from './contexts/DigitDesignContext'
import Gallery from './components/Gallery/Gallery'

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

function AppContent() {
  const [activeView, setActiveView] = useState<ViewKey>(getInitialView)

  return (
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
        {activeView === 'gallery' && <Gallery />}
      </div>
    </div>
  )
}

function App() {
  return (
    <ClockStyleProvider>
      <SavedDesignsProvider>
        <DigitDesignProvider>
          <AppContent />
        </DigitDesignProvider>
      </SavedDesignsProvider>
    </ClockStyleProvider>
  )
}

export default App
