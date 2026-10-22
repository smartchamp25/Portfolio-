import { useState, useCallback } from 'react'

interface UseMobileMenuReturn {
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
}

/**
 * Custom hook for mobile menu state management
 * @returns Object containing mobile menu state and controls
 */
export const useMobileMenu = (): UseMobileMenuReturn => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
  }
}
