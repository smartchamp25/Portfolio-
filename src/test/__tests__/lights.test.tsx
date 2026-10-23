/**
 * Stage lights: the scene change between acts
 */

import { useEffect } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type NavigateFunction,
} from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LightsProvider, useGoToScene, useLightsPhase } from '@/theatre/lights'
import type { SceneId } from '@/theatre/scenes'

let goTo!: (id: SceneId) => void

const Probe = () => {
  const go = useGoToScene()
  useEffect(() => {
    goTo = go
  }, [go])
  const phase = useLightsPhase()
  const { pathname } = useLocation()
  return <div data-testid="probe" data-phase={phase} data-path={pathname} />
}

const renderProbe = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LightsProvider>
        <Probe />
      </LightsProvider>
    </MemoryRouter>
  )

const probe = () => screen.getByTestId('probe')
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))

const reduceMotion = (on: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: on,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('stage lights', () => {
  const original = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers()
    reduceMotion(false)
    sessionStorage.clear()
    sessionStorage.setItem('theatre:curtain-seen', '1')
  })

  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = original
  })

  it('dims, changes scene, then opens the spotlight', () => {
    renderProbe('/')
    act(() => goTo('about'))
    expect(probe()).toHaveAttribute('data-phase', 'down')
    expect(probe()).toHaveAttribute('data-path', '/')
    advance(350)
    expect(probe()).toHaveAttribute('data-path', '/about')
    expect(probe()).toHaveAttribute('data-phase', 'up')
    advance(650)
    expect(probe()).toHaveAttribute('data-phase', 'idle')
  })

  it('ignores repeated requests mid-transition', () => {
    renderProbe('/')
    act(() => goTo('about'))
    advance(100)
    act(() => goTo('skills'))
    advance(1000)
    expect(probe()).toHaveAttribute('data-path', '/about')
  })

  it('does nothing for the current scene', () => {
    renderProbe('/about')
    act(() => goTo('about'))
    expect(probe()).toHaveAttribute('data-phase', 'idle')
  })

  it('uses a quick fade when motion is reduced', () => {
    reduceMotion(true)
    renderProbe('/')
    act(() => goTo('about'))
    advance(75)
    expect(probe()).toHaveAttribute('data-path', '/about')
    advance(75)
    expect(probe()).toHaveAttribute('data-phase', 'idle')
  })

  it('focuses the new heading after navigating', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('link', { name: 'Skills' }))
    advance(1000)
    expect(document.activeElement?.id).toBe('skills-title')
  })

  it('handles back and forward without the lights', () => {
    let navigate!: NavigateFunction
    const Back = () => {
      const nav = useNavigate()
      useEffect(() => {
        navigate = nav
      }, [nav])
      return null
    }
    const { container } = render(
      <MemoryRouter initialEntries={['/about', '/skills']} initialIndex={1}>
        <ThemeProvider>
          <App />
          <Back />
        </ThemeProvider>
      </MemoryRouter>
    )
    act(() => navigate(-1))
    expect(
      screen.getByRole('heading', { name: /Great design/ })
    ).toBeInTheDocument()
    expect(document.title).toBe('Act I · About | Marwan')
    expect(container.querySelector('.stage-lights--idle')).toBeInTheDocument()
  })
})
