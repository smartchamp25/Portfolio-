import { useState, useEffect } from 'react'

interface UseScrollOptions {
  scrollThreshold?: number
}

interface UseScrollReturn {
  scrolled: boolean
}

/**
 * Whether the page has scrolled past a threshold (for the frosted top bar)
 * @param options - Configuration options
 * @returns Object containing scroll state
 */
export const useScroll = (options: UseScrollOptions = {}): UseScrollReturn => {
  const { scrollThreshold = 50 } = options

  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > scrollThreshold)

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold])

  return { scrolled }
}
