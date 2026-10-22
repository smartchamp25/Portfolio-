import { useState, useEffect } from 'react'

interface UseScrollOptions {
  scrollThreshold?: number
  sectionIds?: readonly string[]
  sectionOffset?: number
}

interface UseScrollReturn {
  scrolled: boolean
  activeSection: string
}

/**
 * Custom hook for scroll-related state management
 * @param options - Configuration options
 * @returns Object containing scroll state
 */
export const useScroll = (options: UseScrollOptions = {}): UseScrollReturn => {
  const { scrollThreshold = 50, sectionIds = [], sectionOffset = 200 } = options

  const [scrolled, setScrolled] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds[0] || ''
  )

  useEffect(() => {
    const handleScroll = () => {
      // Track scrolled state
      setScrolled(window.scrollY > scrollThreshold)

      // Track which section is currently in view
      if (sectionIds.length > 0) {
        for (const section of sectionIds) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= sectionOffset && rect.bottom >= sectionOffset) {
              setActiveSection(section)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold, sectionIds, sectionOffset])

  return { scrolled, activeSection }
}
