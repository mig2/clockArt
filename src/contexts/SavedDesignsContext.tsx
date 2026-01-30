import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { SavedDesign } from '../data/savedDesigns'
import { loadSavedDesigns, persistSavedDesigns } from '../data/savedDesigns'

interface SavedDesignsContextValue {
  /** All saved designs */
  designs: SavedDesign[]
  /** Save a new design (id and createdAt are auto-generated) */
  saveDesign: (input: Omit<SavedDesign, 'id' | 'createdAt'>) => void
  /** Delete a saved design by id */
  deleteDesign: (id: string) => void
  /** Get all saved designs for a specific digit */
  getDesignsForDigit: (digit: string) => SavedDesign[]
}

const SavedDesignsContext = createContext<SavedDesignsContextValue>({
  designs: [],
  saveDesign: () => {},
  deleteDesign: () => {},
  getDesignsForDigit: () => [],
})

export function SavedDesignsProvider({ children }: { children: ReactNode }) {
  const [designs, setDesigns] = useState<SavedDesign[]>(loadSavedDesigns)

  const saveDesign = useCallback(
    (input: Omit<SavedDesign, 'id' | 'createdAt'>) => {
      setDesigns((prev) => {
        const newDesign: SavedDesign = {
          ...input,
          id: crypto.randomUUID?.() ?? String(Date.now()),
          createdAt: Date.now(),
        }
        const updated = [...prev, newDesign]
        persistSavedDesigns(updated)
        return updated
      })
    },
    [],
  )

  const deleteDesign = useCallback((id: string) => {
    setDesigns((prev) => {
      const updated = prev.filter((d) => d.id !== id)
      persistSavedDesigns(updated)
      return updated
    })
  }, [])

  const getDesignsForDigit = useCallback(
    (digit: string) => {
      return designs.filter((d) => d.digit === digit)
    },
    [designs],
  )

  return (
    <SavedDesignsContext.Provider
      value={{ designs, saveDesign, deleteDesign, getDesignsForDigit }}
    >
      {children}
    </SavedDesignsContext.Provider>
  )
}

export function useSavedDesigns(): SavedDesignsContextValue {
  return useContext(SavedDesignsContext)
}
