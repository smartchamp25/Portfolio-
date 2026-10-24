/**
 * App routing tests: each act is its own scene
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { voiceUrl } from '@/theatre/media'

// A music file exists in these tests; the curtain video doesn't, and voice
// files are absent unless a test provides them
vi.mock('@/theatre/media', () => ({
  pickFile: () => undefined,
  voiceUrl: vi.fn(() => undefined),
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
    renderAt('/')
    expect(
      screen.getByRole('button', { name: 'Take your seat' })
    ).toBeInTheDocument()
  })

  it('brings the top bar in as the curtain reveals the stage', () => {
    const { container } = renderAt('/')
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    // The drawn curtain takes 3.2 s to open, then reveals the stage
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(300))
    expect(container.querySelector('.curtain')).toBeInTheDocument()
    expect(screen.getByRole('banner')).not.toHaveAttribute('inert')
  })

  it('keeps the stage still until the curtain reveals it', () => {
    const { container } = renderAt('/')
    const main = container.querySelector('main')!
    fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(main).toHaveAttribute('inert')
    expect(container.querySelector('.portfolio--curtained')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2300))
    expect(main).not.toHaveAttribute('inert')
    expect(
      container.querySelector('.portfolio--curtained')
    ).not.toBeInTheDocument()
  })

  it('shows the top bar at once when the intro is skipped', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }))
    expect(screen.getByRole('banner')).not.toHaveAttribute('inert')
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

  it('speaks the opening line after "Take your seat"', async () => {
    vi.mocked(voiceUrl).mockImplementation((id) => `/voice/${id}.mp3`)
    const played: string[] = []
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
      this: HTMLMediaElement
    ) {
      played.push(this.src)
      return Promise.resolve()
    })
    renderAt('/')
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    })
    expect(played.some((src) => src.endsWith('/voice/curtain.mp3'))).toBe(true)
    vi.mocked(voiceUrl).mockImplementation(() => undefined)
  })

  it('still works when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    renderAt('/')
    expect(
      screen.getByRole('button', { name: 'Take your seat' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Enter without sound' }))
    act(() => vi.advanceTimersByTime(5000))
    expect(
      screen.getByRole('heading', { level: 1, name: /Marwan/ })
    ).toBeInTheDocument()
  })

  it('ignores the arrow keys while the curtain is closed', () => {
    renderAt('/')
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    act(() => vi.advanceTimersByTime(1000))
    expect(document.title).toBe('Marwan - Frontend Developer | Portfolio')
    expect(sessionStorage.getItem('theatre:line:about')).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Take your seat' })
    ).toBeInTheDocument()
  })

  it('never puts a line on screen as text', async () => {
    vi.mocked(voiceUrl).mockImplementation((id) => `/voice/${id}.mp3`)
    renderAt('/')
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Take your seat' }))
    })
    expect(screen.queryByText(/curtain rises/)).not.toBeInTheDocument()
    vi.mocked(voiceUrl).mockImplementation(() => undefined)
  })

  it('reaches the curtain first with the keyboard', async () => {
    // user-event waits on real timers between steps
    vi.useRealTimers()
    const user = userEvent.setup()
    renderAt('/')
    expect(
      screen.getByRole('button', { name: 'Take your seat' })
    ).not.toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Take your seat' })).toHaveFocus()
  })
})
