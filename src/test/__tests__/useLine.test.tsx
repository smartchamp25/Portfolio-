/**
 * Act lines: once per visit, voice when possible, surtitle always
 */

import { useEffect } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import {
  MemoryRouter,
  useNavigate,
  type NavigateFunction,
} from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SoundProvider, useSound } from '@/theatre/sound'
import { SurtitleProvider, Surtitles } from '@/theatre/surtitles'
import { useLine } from '@/theatre/useLine'
import { LINES } from '@/theatre/lines'
import type { LineId } from '@/theatre/scenes'

let say!: (id: LineId) => void
let setSoundOn!: (on: boolean) => void

const Probe = ({ voice }: { voice?: string }) => {
  const line = useLine(() => voice)
  const sound = useSound()
  useEffect(() => {
    say = line
    setSoundOn = sound.setSoundOn
  }, [line, sound])
  return null
}

const renderLine = (voice?: string) =>
  render(
    <SoundProvider musicSrc={undefined}>
      <SurtitleProvider>
        <Probe voice={voice} />
        <Surtitles />
      </SurtitleProvider>
    </SoundProvider>
  )

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))

describe('act lines', () => {
  let played: HTMLMediaElement[]
  let playSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    played = []
    playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(function (this: HTMLMediaElement) {
        played.push(this)
        return Promise.resolve()
      })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows the line once per session', () => {
    renderLine()
    act(() => say('about'))
    expect(screen.getByText(LINES.about)).toBeInTheDocument()
    advance(3500)
    act(() => say('about'))
    expect(screen.queryByText(LINES.about)).not.toBeInTheDocument()
    expect(sessionStorage.getItem('theatre:line:about')).toBe('1')
  })

  it('shows a surtitle without sound', () => {
    renderLine('/v.mp3')
    act(() => say('skills'))
    expect(screen.getByText(LINES.skills)).toBeInTheDocument()
    expect(playSpy).not.toHaveBeenCalled()
    advance(3500)
    expect(screen.queryByText(LINES.skills)).not.toBeInTheDocument()
  })

  it('plays the voice when sound is on', async () => {
    renderLine('/v.mp3')
    act(() => setSoundOn(true))
    await act(async () => say('projects'))
    const voice = played.slice(-1)[0]
    expect(voice.src).toMatch(/\/v\.mp3$/)
    advance(5000)
    expect(screen.getByText(LINES.projects)).toBeInTheDocument()

    await act(async () => {
      voice.dispatchEvent(new Event('ended'))
    })
    expect(screen.getByText(LINES.projects)).toBeInTheDocument()
    advance(1000)
    expect(screen.queryByText(LINES.projects)).not.toBeInTheDocument()
  })

  it('falls back to text when the voice fails', async () => {
    renderLine('/v.mp3')
    act(() => setSoundOn(true))
    playSpy.mockImplementation(() => Promise.reject(new Error('blocked')))
    await act(async () => say('contact'))
    expect(screen.getByText(LINES.contact)).toBeInTheDocument()
    advance(3500)
    expect(screen.queryByText(LINES.contact)).not.toBeInTheDocument()
  })

  it('keeps the new surtitle when a line is interrupted', async () => {
    renderLine('/v.mp3')
    act(() => setSoundOn(true))
    await act(async () => say('about'))
    await act(async () => say('skills'))
    expect(screen.getByText(LINES.skills)).toBeInTheDocument()
    expect(screen.queryByText(LINES.about)).not.toBeInTheDocument()
    advance(1000)
    expect(screen.getByText(LINES.skills)).toBeInTheDocument()
  })

  describe('in the app', () => {
    beforeEach(() => sessionStorage.setItem('theatre:curtain-seen', '1'))

    it('plays the act line on arrival', () => {
      render(
        <MemoryRouter initialEntries={['/skills']}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </MemoryRouter>
      )
      expect(screen.getByText(LINES.skills)).toBeInTheDocument()
    })

    it('does not repeat a line on back and forward', () => {
      let navigate!: NavigateFunction
      const History = () => {
        const nav = useNavigate()
        useEffect(() => {
          navigate = nav
        }, [nav])
        return null
      }
      render(
        <MemoryRouter initialEntries={['/about', '/skills']} initialIndex={0}>
          <ThemeProvider>
            <App />
            <History />
          </ThemeProvider>
        </MemoryRouter>
      )
      expect(screen.getByText(LINES.about)).toBeInTheDocument()
      advance(3500)
      act(() => navigate(1))
      expect(screen.getByText(LINES.skills)).toBeInTheDocument()
      act(() => navigate(-1))
      expect(screen.queryByText(LINES.about)).not.toBeInTheDocument()
    })
  })
})
