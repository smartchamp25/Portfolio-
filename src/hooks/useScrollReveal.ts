import { useEffect } from 'react'

interface UseScrollRevealOptions {
  /** Pixels from the bottom of the viewport at which an element is revealed */
  threshold?: number
  selector?: string
}

/**
 * Custom hook for scroll-based reveal animations.
 * Adds the 'visible' class to matching elements once they enter the viewport.
 * Also picks up elements rendered later (lazy-loaded sections).
 */
export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { threshold = 96, selector = '.reveal-on-scroll' } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: `0px 0px -${threshold}px 0px` }
    )

    const observeAll = () => {
      document
        .querySelectorAll(`${selector}:not(.visible)`)
        .forEach((el) => observer.observe(el))
    }

    observeAll()

    // Lazy sections mount after this effect runs — watch for them
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
  }, [threshold, selector])
}
