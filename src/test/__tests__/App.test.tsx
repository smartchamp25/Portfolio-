/**
 * App routing tests: each act is its own scene
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LINES } from '@/theatre/lines'

// A music file exists in these tests; voice and curtain video don't
vi.mock('@/theatre/media', () => ({
  pickFile: () => undefined,
  voiceUrl: () => undefined,
  musicUrl: '/m.mp3',
  curtainVideo: undefined,
}))

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

describe('App curtain', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows the curtain on a first visit to the home page', () => {
    const { container } = renderAt('/')
    expect(
      screen.getByRole('button', { name: 'Take your seat' })
    ).toBeInTheDocument()
    expect(container.querySelector('.site-header--intro')).toBeInTheDocument()
  })

  it('skips the curtain on a direct link', () => {
    renderAt('/about')
    expect(
      screen.queryByRole('button', { name: 'Take your seat' })
    ).not.toBeInTheDocument()
    expect(sessionStorage.getItem('theatre:curtain-seen')).toBeNull()
  })

  it('shows the curtain once per session', () => {
    const first = renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    act(() => vi.advanceTimersByTime(5000))
    first.unmount()
    renderAt('/')
    expect(
      screen.queryByRole('button', { name: 'Take your seat' })
    ).not.toBeInTheDocument()
  })

  it('lets an act link bypass the intro', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }))
    act(() => vi.advanceTimersByTime(0))
    expect(
      screen.getByRole('heading', { level: 2, name: /curtain call/ })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Take your seat' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Turn sound on' })
    ).toBeInTheDocument()
  })

  it('starts the music when sound is turned on after a direct link', () => {
    const played: HTMLMediaElement[] = []
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
      this: HTMLMediaElement
    ) {
      played.push(this)
      return Promise.resolve()
    })
    renderAt('/about')
    fireEvent.click(screen.getByRole('button', { name: 'Turn sound on' }))
    expect(played.some((el) => el.loop)).toBe(true)
  })

  it('plays the opening line on entry', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: 'Enter without sound' }))
    expect(screen.getByText(LINES.curtain)).toBeInTheDocument()
  })
})
