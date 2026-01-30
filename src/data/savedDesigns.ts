// Saved custom digit designs — data model and localStorage persistence

const STORAGE_KEY = 'clockart-saved-designs'

/** A user-saved custom digit design */
export interface SavedDesign {
  /** Unique identifier */
  id: string
  /** User-provided name (e.g. "Rounded Zero") */
  name: string
  /** Which digit this is a variant of ("0"-"9") */
  digit: string
  /** Clock angle pairs for the 6-clock grid [a, b, c, d, e, f] */
  clocks: { hour: number; minute: number }[]
  /** Timestamp for sort ordering */
  createdAt: number
}

/** Load all saved designs from localStorage */
export function loadSavedDesigns(): SavedDesign[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

/** Persist saved designs to localStorage */
export function persistSavedDesigns(designs: SavedDesign[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}
