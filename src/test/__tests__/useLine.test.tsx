/**
 * Act lines: spoken once per visit, the first time they can be heard
 */

import { useEffect } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import {
  MemoryRouter,
  useNavigate,
  type NavigateFunction,
} from 'react-router-dom'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SoundProvider, useSound } from '@/theatre/sound'
import { useLine } from '@/theatre/useLine'
import type { LineId } from '@/theatre/scenes'

// In the app every line has a voice file in these tests
vi.mock('@/theatre/media', () => ({
  pickFile: () => undefined,
  voiceUrl: (id: string) => `/voice/${id}.mp3`,
  musicUrl: undefined,
  curtainVideo: undefined,
}))

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
      <Probe voice={voice} />
    </SoundProvider>
  )

describe('act lines', () => {
  let played: string[]

  /** How many times a voice file was played */
  const plays = (file: string) =>
    played.filter((src) => src.endsWith(file)).length

  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    played = []
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
      this: HTMLMediaElement
    ) {
      played.push(this.src)
      return Promise.resolve()
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('plays the voice once per session when sound is on', async () => {
    renderLine('/v.mp3')
    act(() => setSoundOn(true))
    await act(async () => say('about'))
    await act(async () => say('about'))
    expect(plays('/v.mp3')).toBe(1)
  })

  it('stays silent without sound', async () => {
    renderLine('/v.mp3')
    await act(async () => say('skills'))
    expect(plays('/v.mp3')).toBe(0)
  })

  it('speaks a line missed without sound once sound is on', async () => {
    renderLine('/v.mp3')
    await act(async () => say('skills'))
    act(() => setSoundOn(true))
    await act(async () => say('skills'))
    expect(plays('/v.mp3')).toBe(1)
  })

  it('stays silent when the line has no voice', async () => {
    renderLine(undefined)
    act(() => setSoundOn(true))
    await act(async () => say('contact'))
    expect(sessionStorage.getItem('theatre:line:contact')).toBeNull()
  })

  describe('in the app', () => {
    let navigate!: NavigateFunction
    const History = () => {
      const nav = useNavigate()
      useEffect(() => {
        navigate = nav
      }, [nav])
      return null
    }

    beforeEach(() => sessionStorage.setItem('theatre:curtain-seen', '1'))

    const renderApp = (entries: string[]) =>
      render(
        <MemoryRouter initialEntries={entries} initialIndex={0}>
          <ThemeProvider>
            <App />
            <History />
          </ThemeProvider>
        </MemoryRouter>
      )

    it('plays the act line on arrival', async () => {
      renderApp(['/'])
      fireEvent.click(screen.getByRole('button', { name: 'Turn sound on' }))
      fireEvent.click(screen.getByRole('link', { name: 'Skills' }))
      await act(async () => vi.advanceTimersByTime(1000))
      expect(plays('/voice/skills.mp3')).toBe(1)
    })

    it('does not repeat a line on back and forward', async () => {
      renderApp(['/', '/about', '/skills'])
      fireEvent.click(screen.getByRole('button', { name: 'Turn sound on' }))
      await act(async () => navigate(1))
      await act(async () => navigate(1))
      await act(async () => navigate(-1))
      expect(plays('/voice/about.mp3')).toBe(1)
      expect(plays('/voice/skills.mp3')).toBe(1)
    })
  })
})
