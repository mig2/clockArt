import './NavBar.css'

export type ViewKey = 'clock' | 'grid' | 'playground' | 'realtime' | 'gallery'

interface NavItem {
  key: ViewKey
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'clock', label: 'Clock' },
  { key: 'grid', label: 'Grid' },
  { key: 'playground', label: 'Playground' },
  { key: 'realtime', label: 'Real Time' },
  { key: 'gallery', label: 'Gallery' },
]

interface NavBarProps {
  activeView: ViewKey
  onViewChange: (view: ViewKey) => void
}

function NavBar({ activeView, onViewChange }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <div className="nav-btn-group">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={activeView === item.key ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onViewChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
