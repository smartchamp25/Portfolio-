import { Moon, Sun } from 'lucide-react'
import { IconButton } from '../fourth-act'
import { useTheme } from '../../contexts/ThemeContext'
import './ThemeToggle.css'

// ==========================================
// THEME TOGGLE — Void (dark) ⇄ Vellum (light)
// ==========================================

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <IconButton
      size="sm"
      className="theme-toggle"
      label={`Switch to ${next} mode`}
      onClick={toggleTheme}
    >
      {/* key forces a remount so the icon plays its entrance on every switch */}
      <span key={theme} className="theme-toggle__icon">
        {theme === 'dark' ? (
          <Moon size={16} strokeWidth={1.5} />
        ) : (
          <Sun size={16} strokeWidth={1.5} />
        )}
      </span>
    </IconButton>
  )
}

export default ThemeToggle
