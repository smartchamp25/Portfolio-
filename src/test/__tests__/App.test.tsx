/**
 * App routing tests: each act is its own scene
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  )

describe('App routing', () => {
  beforeEach(() => {
    sessionStorage.clear()
    sessionStorage.setItem('theatre:curtain-seen', '1')
    document.head
      .querySelectorAll('link[rel="canonical"]')
      .forEach((l) => l.remove())
  })

  it('opens a direct link on its scene', () => {
    const { container } = renderAt('/projects')
    expect(
      screen.getByRole('heading', { level: 2, name: /curtain call/ })
    ).toBeInTheDocument()
    expect(container.querySelector('#about')).not.toBeInTheDocument()
  })

  it('renders exactly one scene at a time', () => {
    const { container } = renderAt('/skills')
    expect(container.querySelectorAll('main section')).toHaveLength(1)
  })

  it('redirects unknown addresses to the prologue', () => {
    renderAt('/nope')
    expect(
      screen.getByRole('heading', { level: 1, name: /Marwan/ })
    ).toBeInTheDocument()
  })

  it('sets the page title per scene', () => {
    renderAt('/about')
    expect(document.title).toBe('Act I · About | Marwan')
  })

  it('points the canonical link at the scene', () => {
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = 'x'
    document.head.append(link)
    renderAt('/contact')
    expect(link.getAttribute('href')).toBe(
      'https://yourportfolio.vercel.app/contact'
    )
  })

  it('navigates when an act link is clicked', () => {
    vi.useFakeTimers()
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: 'Skills' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('heading', { name: /reach/ })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
