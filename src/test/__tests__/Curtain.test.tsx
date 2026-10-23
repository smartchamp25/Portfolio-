/**
 * Curtain intro tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import Curtain, { CURTAIN_OPEN_MS, CURTAIN_FADE_MS } from '@/theatre/Curtain'

const setup = (video?: { src: string; poster?: string }) => {
  const props = {
    onEnter: vi.fn(),
    onSkip: vi.fn(),
    onOpened: vi.fn(),
    video,
  }
  render(<Curtain {...props} />)
  return props
}

const reduceMotion = (on: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: on,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('Curtain', () => {
  const original = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    reduceMotion(false)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    window.matchMedia = original
  })

  it('offers both ways in and a skip', () => {
    setup()
    const seat = screen.getByRole('button', { name: 'Take your seat' })
    expect(seat).toHaveClass('fa-btn--primary')
    expect(seat).toHaveFocus()
    expect(
      screen.getByRole('button', { name: 'Enter without sound' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Skip intro' })
    ).toBeInTheDocument()
  })

  it('makes the remembered choice primary', () => {
    localStorage.setItem('theatre:sound', 'off')
    setup()
    expect(
      screen.getByRole('button', { name: 'Enter without sound' })
    ).toHaveClass('fa-btn--primary')
  })

  it('reports the choice, then opens', () => {
    const props = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    expect(props.onEnter).toHaveBeenCalledWith(true)
    act(() => vi.advanceTimersByTime(CURTAIN_OPEN_MS + CURTAIN_FADE_MS - 1))
    expect(props.onOpened).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(props.onOpened).toHaveBeenCalledTimes(1)
  })

  it('opens straight away with reduced motion', () => {
    reduceMotion(true)
    const props = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Enter without sound' }))
    expect(props.onEnter).toHaveBeenCalledWith(false)
    expect(props.onOpened).toHaveBeenCalledTimes(1)
  })

  it('skips', () => {
    const props = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }))
    expect(props.onSkip).toHaveBeenCalledTimes(1)
    expect(props.onEnter).not.toHaveBeenCalled()
  })

  it('falls back to the drawn curtain when the video cannot play', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() =>
      Promise.reject(new Error('blocked'))
    )
    const props = setup({ src: '/c.mp4' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    })
    await act(async () => {
      vi.advanceTimersByTime(CURTAIN_OPEN_MS + CURTAIN_FADE_MS)
    })
    expect(props.onOpened).toHaveBeenCalledTimes(1)
  })
})
