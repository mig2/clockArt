import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

/** The visual style properties that can be saved globally */
export interface ClockStyle {
  // Colors
  hourHandColor: string
  minuteHandColor: string
  secondHandColor: string
  tickColor: string
  faceColor: string
  // Stroke widths
  hourHandWidth: number
  minuteHandWidth: number
  secondHandWidth: number
  faceStrokeWidth: number
  tickStrokeWidth: number
  cardinalTickStrokeWidth: number
  // Display toggles
  showTickMarks: boolean
  showCardinalTicks: boolean
  showRegularTicks: boolean
}

export const DEFAULT_CLOCK_STYLE: ClockStyle = {
  hourHandColor: '#333333',
  minuteHandColor: '#333333',
  secondHandColor: '#e74c3c',
  tickColor: '#333333',
  faceColor: '#333333',
  hourHandWidth: 4,
  minuteHandWidth: 2.5,
  secondHandWidth: 1,
  faceStrokeWidth: 1.5,
  tickStrokeWidth: 1,
  cardinalTickStrokeWidth: 2,
  showTickMarks: true,
  showCardinalTicks: true,
  showRegularTicks: true,
}

interface ClockStyleContextValue {
  style: ClockStyle
  setStyle: (style: ClockStyle) => void
  resetStyle: () => void
}

const ClockStyleContext = createContext<ClockStyleContextValue>({
  style: DEFAULT_CLOCK_STYLE,
  setStyle: () => {},
  resetStyle: () => {},
})

const STORAGE_KEY = 'clockart-global-style'

function loadStyle(): ClockStyle {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle any missing keys from older versions
      return { ...DEFAULT_CLOCK_STYLE, ...parsed }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CLOCK_STYLE
}

export function ClockStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState<ClockStyle>(loadStyle)

  const setStyle = useCallback((newStyle: ClockStyle) => {
    setStyleState(newStyle)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStyle))
    } catch {
      // Ignore storage errors
    }
  }, [])

  const resetStyle = useCallback(() => {
    setStyleState(DEFAULT_CLOCK_STYLE)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Sync to storage on mount if loaded from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setStyleState(loadStyle())
    }
  }, [])

  return (
    <ClockStyleContext.Provider value={{ style, setStyle, resetStyle }}>
      {children}
    </ClockStyleContext.Provider>
  )
}

/** Hook to access the global clock style */
export function useClockStyle(): ClockStyleContextValue {
  return useContext(ClockStyleContext)
}
