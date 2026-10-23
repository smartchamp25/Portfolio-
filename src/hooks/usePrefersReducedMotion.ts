import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const matches = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false

/**
 * True while the visitor's device asks for less motion; follows changes live
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState<boolean>(matches)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(QUERY)
    const onChange = (e: { matches: boolean }) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
