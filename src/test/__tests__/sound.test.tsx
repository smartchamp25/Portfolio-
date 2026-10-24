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

// The site has no music file in these tests unless one is passed in
vi.mock('@/theatre/media', () => ({
  pickFile: () => undefined,
  voiceUrl: () => undefined,
  musicUrl: undefined,
  curtainVideo: undefined,
}))

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

const musicOf = (els: HTMLMediaElement[]) => els.find((el) => el.loop)!
const lastVoiceOf = (els: HTMLMediaElement[]) =>
  els.filter((el) => !el.loop).slice(-1)[0]

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
    expect(played.some((el) => el.loop)).toBe(true)
  })

  it('fades the music in', () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    act(() => sound.startMusic())
    const music = musicOf(played)
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
    const music = musicOf(played)

    let voiceDone!: Promise<number | null>
    await act(async () => {
      voiceDone = sound.playVoice('/v.mp3')
    })
    expect(music.volume).toBe(MUSIC_DUCKED)

    const voice = lastVoiceOf(played)
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
    const music = musicOf(played)
    const voice = lastVoiceOf(played)

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
    expect(played.some((el) => el.loop)).toBe(false)
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

describe('sound with Web Audio', () => {
  class MockParam {
    value = 0
    cancelScheduledValues = vi.fn()
    setValueAtTime = vi.fn()
    linearRampToValueAtTime = vi.fn((v: number) => {
      this.value = v
    })
  }

  class MockContext {
    static all: MockContext[] = []
    state = 'suspended'
    currentTime = 0
    destination = {}
    gains: MockParam[] = []
    sources: HTMLMediaElement[] = []
    resume = vi.fn(() => {
      this.state = 'running'
      return Promise.resolve()
    })
    createGain = vi.fn(() => {
      const gain = new MockParam()
      this.gains.push(gain)
      return { gain, connect: vi.fn() }
    })
    createMediaElementSource = vi.fn((el: HTMLMediaElement) => {
      this.sources.push(el)
      return { connect: vi.fn() }
    })
    constructor() {
      MockContext.all.push(this)
    }
  }

  let played: HTMLMediaElement[]

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    MockContext.all = []
    ;(window as unknown as { AudioContext: unknown }).AudioContext = MockContext
    played = []
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
      this: HTMLMediaElement
    ) {
      played.push(this)
      return Promise.resolve()
    })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('opens Web Audio and unlocks playback inside the click that turns sound on', () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    expect(MockContext.all).toHaveLength(1)
    expect(MockContext.all[0].resume).toHaveBeenCalled()
    expect(MockContext.all[0].sources.some((el) => el.loop)).toBe(true)
    expect(played.some((el) => el.loop)).toBe(true)
    expect(played.some((el) => !el.loop)).toBe(true)
  })

  it('sets music levels with the gain node, not the element volume', async () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    act(() => sound.startMusic())
    const gain = MockContext.all[0].gains[0]
    expect(gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      MUSIC_VOLUME,
      2
    )

    await act(async () => {
      void sound.playVoice('/v.mp3')
    })
    expect(gain.value).toBe(MUSIC_DUCKED)

    const voice = played.filter((el) => !el.loop).slice(-1)[0]
    await act(async () => {
      voice.dispatchEvent(new Event('ended'))
    })
    expect(gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      MUSIC_VOLUME,
      0.4
    )
    expect(played.find((el) => el.loop)!.volume).toBe(1)
  })

  it('plays every line on the voice player unlocked in the click', async () => {
    renderSound('/m.mp3')
    act(() => sound.setSoundOn(true))
    const unlocked = played.find((el) => !el.loop)!
    await act(async () => {
      void sound.playVoice('/v.mp3')
    })
    const last = played.slice(-1)[0]
    expect(last).toBe(unlocked)
    expect(last.src).toMatch(/\/v\.mp3$/)
  })
})
