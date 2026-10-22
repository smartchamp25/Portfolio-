import { memo } from 'react'
import { NavBar } from '../fourth-act'
import { SECTIONS } from '../../constants'
import { useMobileMenu } from '../../hooks'
import ThemeToggle from '../ui/ThemeToggle'
import './Navigation.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface NavigationProps {
  scrolled: boolean
  activeSection: string
  scrollToSection: (sectionId: string) => void
}

const NAV_ITEMS = SECTIONS.map((label) => ({ id: label.toLowerCase(), label }))

// ==========================================
// NAVIGATION — fixed header built on the Fourth Act NavBar
// ==========================================

const Navigation = ({
  scrolled,
  activeSection,
  scrollToSection,
}: NavigationProps) => {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

  const handleNavigate = (sectionId: string): void => {
    scrollToSection(sectionId)
    closeMobileMenu()
  }

  return (
    <header className="site-header">
      <NavBar
        brand="Marwan"
        items={NAV_ITEMS}
        active={activeSection}
        onNavigate={handleNavigate}
        scrolled={scrolled || mobileMenuOpen}
        menuOpen={mobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        actions={<ThemeToggle />}
      />
    </header>
  )
}

export default memo(Navigation)
