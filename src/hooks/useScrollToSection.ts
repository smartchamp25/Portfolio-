import { useCallback } from 'react'

interface UseScrollToSectionOptions {
  behavior?: ScrollBehavior
  closeMenu?: () => void
}

/**
 * Custom hook for smooth scrolling to sections
 * @param options - Configuration options for scroll behavior
 * @returns Function to scroll to a specific section
 */
export const useScrollToSection = (options: UseScrollToSectionOptions = {}) => {
  const { behavior = 'smooth', closeMenu } = options

  const scrollToSection = useCallback(
    (sectionId: string): void => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior })
        closeMenu?.()
      }
    },
    [behavior, closeMenu]
  )

  return { scrollToSection }
}
