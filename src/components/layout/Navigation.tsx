import { memo } from 'react'
import { NavBar } from '../fourth-act'
import { SCENES, type SceneId } from '../../theatre/scenes'
import { useMobileMenu } from '../../hooks'
import ThemeToggle from '../ui/ThemeToggle'
import SoundToggle from '../../theatre/SoundToggle'
import './Navigation.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface NavigationProps {
  active: SceneId
  onNavigate: (id: SceneId) => void
  scrolled: boolean
  /** While the curtain is up: no bar until the stage is open */
  hidden?: boolean
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
  hidden = false,
}: NavigationProps) => {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

  const handleNavigate = (id: string): void => {
    onNavigate(id as SceneId)
    closeMobileMenu()
  }

  return (
    <header
      className={hidden ? 'site-header site-header--hidden' : 'site-header'}
      inert={hidden}
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
        actions={
          <>
            <SoundToggle />
            <ThemeToggle />
          </>
        }
      />
    </header>
  )
}

export default memo(Navigation)
