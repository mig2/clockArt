import './App.css'
import AnalogClock from './components/AnalogClock/AnalogClock'

function App() {
  return (
    <div className="app">
      <AnalogClock size={300} hours={10} minutes={10} seconds={30} />
    </div>
  )
}

export default App
