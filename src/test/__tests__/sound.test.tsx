/**
 * Sound system tests: music, voices, ducking and the toggle
 */

import { useEffect } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import {
  SoundProvider,
  useSound,
  MUSIC_VOLUME,
  MUSIC_DUCKED,
} from '@/theatre/sound'
import SoundToggle from '@/theatre/SoundToggle'

type SoundApi = ReturnType<typeof useSound>
let sound!: SoundApi

const Probe = () => {
  const api = useSound()
  useEffect(() => {
    sound = api
  }, [api])
  return null
}

const renderSound = (musicSrc?: string) =>
  render(
    <SoundProvider musicSrc={musicSrc}>
      <Probe />
      <SoundToggle />
    </SoundProvider>
  )

let played: HTMLMediaElement[]
let playSpy: ReturnType<typeof vi.spyOn>
let pauseSpy: ReturnType<typeof vi.spyOn>

const setVisibility = (state: 'hidden' | 'visible') => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('sound', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    played = []
    playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(function (this: HTMLMediaElement) {
        played.push(this)
        return Promise.resolve()
      })
    pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    setVisibility('visible')
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('stays silent until sound is turned on, then starts the music', () => {
    renderSound('/m.mp3')
    act(() => sound.startMusic())
    expect(playSpy).not.toHaveBeenCalled()
    act(() => sound.setSoundOn(true))
    expect(playSpy).toHaveBeenCalledTimes(1)
  })

  it('fades the music in', () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    act(() => sound.startMusic())
    expect(playSpy).toHaveBeenCalledTimes(1)
    const music = played[0]
    expect(music.loop).toBe(true)
    expect(music.volume).toBeLessThan(MUSIC_VOLUME)
    act(() => vi.advanceTimersByTime(2000))
    expect(music.volume).toBe(MUSIC_VOLUME)
  })

  it('ducks the music while a voice plays', async () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    act(() => sound.startMusic())
    act(() => vi.advanceTimersByTime(2000))
    const music = played[0]

    let voiceDone!: Promise<number | null>
    await act(async () => {
      voiceDone = sound.playVoice('/v.mp3')
    })
    expect(music.volume).toBe(MUSIC_DUCKED)

    const voice = played[1]
    await act(async () => {
      voice.dispatchEvent(new Event('ended'))
    })
    act(() => vi.advanceTimersByTime(500))
    expect(music.volume).toBe(MUSIC_VOLUME)
    await expect(voiceDone).resolves.toEqual(expect.any(Number))
  })

  it('reports no voice when sound is off or playback fails', async () => {
    renderSound('/m.mp3')
    await expect(sound.playVoice('/v.mp3')).resolves.toBeNull()

    act(() => sound.setSoundOn(true))
    playSpy.mockImplementation(() => Promise.reject(new Error('blocked')))
    let result: number | null = 0
    await act(async () => {
      result = await sound.playVoice('/v.mp3')
    })
    expect(result).toBeNull()
    expect(sound.soundOn).toBe(true)
  })

  it('pauses when the tab is hidden and resumes only the music', async () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    act(() => sound.startMusic())
    await act(async () => {
      void sound.playVoice('/v.mp3')
    })
    const [music, voice] = played

    act(() => setVisibility('hidden'))
    expect(pauseSpy).toHaveBeenCalled()

    played = []
    act(() => setVisibility('visible'))
    expect(played).toContain(music)
    expect(played).not.toContain(voice)
  })

  it('skips music when there is no file', () => {
    renderSound(undefined)
    act(() => sound.setSoundOn(true))
    expect(() => act(() => sound.startMusic())).not.toThrow()
    expect(playSpy).not.toHaveBeenCalled()
  })

  it('toggles from the top bar', () => {
    renderSound('/m.mp3')
    fireEvent.click(screen.getByRole('button', { name: 'Turn sound on' }))
    expect(
      screen.getByRole('button', { name: 'Turn sound off' })
    ).toBeInTheDocument()
    expect(localStorage.getItem('theatre:sound')).toBe('on')
  })
})
