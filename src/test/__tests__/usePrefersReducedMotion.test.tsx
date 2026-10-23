/**
 * usePrefersReducedMotion tests
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrefersReducedMotion } from '@/hooks'

describe('usePrefersReducedMotion', () => {
  const original = window.matchMedia

  afterEach(() => {
    window.matchMedia = original
  })

  it('reads the media query and follows changes', () => {
    let listener: ((e: { matches: boolean }) => void) | undefined
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => {
        listener = fn
      },
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)

    act(() => listener?.({ matches: false }))
    expect(result.current).toBe(false)
  })
})
