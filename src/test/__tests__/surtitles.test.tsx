/**
 * Surtitles tests
 */

import { useEffect } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SurtitleProvider, Surtitles, useSurtitles } from '@/theatre/surtitles'

let show!: (text: string, ms: number) => void

const Probe = () => {
  const api = useSurtitles()
  useEffect(() => {
    show = api.show
  }, [api])
  return null
}

describe('surtitles', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows text in a live region and clears it', () => {
    const { container } = render(
      <SurtitleProvider>
        <Probe />
        <Surtitles />
      </SurtitleProvider>
    )
    act(() => show('Hello', 2000))
    const region = container.querySelector('[aria-live="polite"]')
    expect(region).toContainElement(screen.getByText('Hello'))
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
  })
})
