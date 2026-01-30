import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { DIGITS } from '../data/digits'

type ClockAngles = { hour: number; minute: number }[]

/** Map of digit -> custom clock angles (null = use default DIGITS) */
type ActiveDigitDesigns = Record<string, ClockAngles | null>

const DEFAULT_ACTIVE: ActiveDigitDesigns = {
  '0': null, '1': null, '2': null, '3': null, '4': null,
  '5': null, '6': null, '7': null, '8': null, '9': null,
}

interface DigitDesignContextValue {
  /** Raw active designs map (null entries = default) */
  activeDesigns: ActiveDigitDesigns
  /** Get the active clock angles for a digit (custom if set, otherwise default DIGITS) */
  getActiveDigit: (digit: string) => { hour: number; minute: number }[]
  /** Set a custom design as active for a digit */
  setActiveDigit: (digit: string, clocks: ClockAngles) => void
  /** Reset a single digit back to default */
  resetDigit: (digit: string) => void
  /** Reset all digits back to defaults */
  resetAll: () => void
}

const DigitDesignContext = createContext<DigitDesignContextValue>({
  activeDesigns: DEFAULT_ACTIVE,
  getActiveDigit: (digit: string) => DIGITS[digit] ?? [],
  setActiveDigit: () => {},
  resetDigit: () => {},
  resetAll: () => {},
})

const STORAGE_KEY = 'clockart-active-digits'

function loadActiveDesigns(): ActiveDigitDesigns {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_ACTIVE, ...parsed }
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { ...DEFAULT_ACTIVE }
}

function persistActiveDesigns(designs: ActiveDigitDesigns): void {
  try {
    // Only store non-null entries to keep storage minimal
    const toStore: Record<string, ClockAngles> = {}
    for (const [digit, clocks] of Object.entries(designs)) {
      if (clocks !== null) {
        toStore[digit] = clocks
      }
    }
    if (Object.keys(toStore).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export function DigitDesignProvider({ children }: { children: ReactNode }) {
  const [activeDesigns, setActiveDesigns] = useState<ActiveDigitDesigns>(loadActiveDesigns)

  const getActiveDigit = useCallback(
    (digit: string): { hour: number; minute: number }[] => {
      const custom = activeDesigns[digit]
      if (custom) return custom
      return DIGITS[digit] ?? []
    },
    [activeDesigns],
  )

  const setActiveDigit = useCallback(
    (digit: string, clocks: ClockAngles) => {
      setActiveDesigns((prev) => {
        const updated = { ...prev, [digit]: clocks }
        persistActiveDesigns(updated)
        return updated
      })
    },
    [],
  )

  const resetDigit = useCallback((digit: string) => {
    setActiveDesigns((prev) => {
      const updated = { ...prev, [digit]: null }
      persistActiveDesigns(updated)
      return updated
    })
  }, [])

  const resetAll = useCallback(() => {
    setActiveDesigns({ ...DEFAULT_ACTIVE })
    persistActiveDesigns(DEFAULT_ACTIVE)
  }, [])

  return (
    <DigitDesignContext.Provider
      value={{ activeDesigns, getActiveDigit, setActiveDigit, resetDigit, resetAll }}
    >
      {children}
    </DigitDesignContext.Provider>
  )
}

/** Hook to access the active digit designs */
export function useDigitDesign(): DigitDesignContextValue {
  return useContext(DigitDesignContext)
}
