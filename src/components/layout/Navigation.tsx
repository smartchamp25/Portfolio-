import { memo } from 'react'
import { NavBar } from '../fourth-act'
import { SCENES, type SceneId } from '../../theatre/scenes'
import { useMobileMenu } from '../../hooks'
import ThemeToggle from '../ui/ThemeToggle'
import './Navigation.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface NavigationProps {
  active: SceneId
  onNavigate: (id: SceneId) => void
  scrolled: boolean
  /** While the curtain is closed: dimmed bar, act links only */
  intro?: boolean
}

const NAV_ITEMS = SCENES.filter((scene) => scene.act).map((scene) => ({
  id: scene.id,
  label: scene.label,
  href: scene.path,
}))

// ==========================================
// NAVIGATION — fixed header built on the Fourth Act NavBar
// ==========================================

const Navigation = ({
  active,
  onNavigate,
  scrolled,
  intro = false,
}: NavigationProps) => {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

  const handleNavigate = (id: string): void => {
    onNavigate(id as SceneId)
    closeMobileMenu()
  }

  return (
    <header
      className={intro ? 'site-header site-header--intro' : 'site-header'}
    >
      <NavBar
        brand="Marwan"
        brandHref="/"
        items={NAV_ITEMS}
        active={active}
        onNavigate={handleNavigate}
        scrolled={scrolled || mobileMenuOpen}
        menuOpen={mobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        actions={intro ? undefined : <ThemeToggle />}
      />
    </header>
  )
}

export default memo(Navigation)
