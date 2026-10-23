/**
 * Lotus trap tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import LotusTrap from '@/components/ui/LotusTrap'
import { Quote } from '@/components/fourth-act'

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

describe('LotusTrap', () => {
  const originalObserver = globalThis.IntersectionObserver
  const originalMatchMedia = window.matchMedia
  let observe: ObserverCallback

  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      constructor(cb: ObserverCallback) {
        observe = cb
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver
    window.matchMedia = originalMatchMedia
  })

  const trap = (container: HTMLElement) =>
    container.querySelector('.lotus-trap') as HTMLElement

  it('stacks three decorative layers', () => {
    const { container } = render(<LotusTrap />)
    const imgs = container.querySelectorAll('.lotus-trap img')
    expect(imgs).toHaveLength(3)
    imgs.forEach((img) => expect(img).toHaveAttribute('alt', ''))
  })

  it('arms when it comes into view', () => {
    const { container } = render(<LotusTrap />)
    act(() => observe([{ isIntersecting: true }]))
    expect(trap(container)).toHaveClass('is-arming')
    const inner = container.querySelector('.lotus-trap__inner')!
    fireEvent.animationEnd(inner)
    expect(trap(container)).not.toHaveClass('is-arming')
  })

  it('replays on hover', () => {
    const { container } = render(<LotusTrap />)
    fireEvent.mouseEnter(trap(container))
    expect(trap(container)).toHaveClass('is-arming')
  })

  it('stays still with reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const { container } = render(<LotusTrap />)
    act(() => observe?.([{ isIntersecting: true }]))
    fireEvent.mouseEnter(trap(container))
    expect(trap(container)).not.toHaveClass('is-arming')
  })

  it('replaces the drawn lotus in the quote', () => {
    const { container } = render(
      <Quote cite="Someone" mark={<span data-testid="m" />}>
        Words
      </Quote>
    )
    expect(screen.getByTestId('m')).toBeInTheDocument()
    expect(container.querySelector('svg.fa-quote__lotus')).toBeNull()
  })
})
