import AnalogClock from '../AnalogClock/AnalogClock'
import { DIGITS } from '../../data/digits'
import { useDigitDesign } from '../../contexts/DigitDesignContext'
import { useSavedDesigns } from '../../contexts/SavedDesignsContext'
import './Gallery.css'

const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Clock size (px) for the current-set overview — mid-size for readability */
const CURRENT_SET_CLOCK_SIZE = 48

/** Clock size (px) for variant preview grids — smaller to fit multiple variants */
const VARIANT_CLOCK_SIZE = 52

interface Variant {
  id: string
  name: string
  clocks: { hour: number; minute: number }[]
  isDefault: boolean
}

function Gallery() {
  const { activeDesigns, getActiveDigit, setActiveDigit, resetDigit } = useDigitDesign()
  const { getDesignsForDigit } = useSavedDesigns()

  function isVariantActive(variant: Variant, digit: string): boolean {
    const active = activeDesigns[digit]
    const isDefaultActive = active === null || active === undefined
    if (variant.isDefault) return isDefaultActive
    if (isDefaultActive) return false
    return JSON.stringify(active) === JSON.stringify(variant.clocks)
  }

  function handleVariantClick(digit: string, variant: Variant) {
    if (variant.isDefault) {
      resetDigit(digit)
    } else {
      setActiveDigit(digit, variant.clocks)
    }
  }

  return (
    <div className="gallery">
      {/* Current production digit set overview */}
      <div className="gallery-current-set">
        <div className="gallery-current-set-label">Current Set</div>
        <div className="gallery-current-set-digits">
          {ALL_DIGITS.map((digit) => (
            <div key={digit} className="gallery-current-set-digit">
              <div className="gallery-current-set-digit-label">{digit}</div>
              <div className="gallery-current-set-grid">
                {getActiveDigit(digit).map((clock, i) => (
                  <AnalogClock
                    key={i}
                    size={CURRENT_SET_CLOCK_SIZE}
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

      <hr className="gallery-divider" />

      {/* Per-digit alternates */}
      {ALL_DIGITS.map((digit) => {
        const customDesigns = getDesignsForDigit(digit)
        const variants: Variant[] = [
          { id: 'default', name: 'Default', clocks: DIGITS[digit], isDefault: true },
          ...customDesigns.map((d) => ({
            id: d.id,
            name: d.name,
            clocks: d.clocks,
            isDefault: false,
          })),
        ]

        return (
          <div key={digit} className="gallery-digit-group">
            <div className="gallery-digit-label">{digit}</div>
            <div className="gallery-variants">
              {variants.map((variant) => {
                const active = isVariantActive(variant, digit)
                return (
                  <div
                    key={variant.id}
                    className={`gallery-variant${active ? ' gallery-variant--active' : ''}`}
                    onClick={() => handleVariantClick(digit, variant)}
                    title={
                      active
                        ? `${variant.name} (active)`
                        : `Set "${variant.name}" as active for digit ${digit}`
                    }
                  >
                    <div className="gallery-variant-grid">
                      {variant.clocks.map((clock, i) => (
                        <AnalogClock
                          key={i}
                          size={VARIANT_CLOCK_SIZE}
                          hourAngleDeg={clock.hour}
                          minuteAngleDeg={clock.minute}
                          showSecondHand={false}
                        />
                      ))}
                    </div>
                    <div className="gallery-variant-name">{variant.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Gallery
