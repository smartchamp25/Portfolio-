/* The provider lives beside its hook and levels on purpose, like ThemeContext;
   editing this file reloads the page instead of hot-swapping */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { musicUrl } from './media'
import { setSoundPreference } from './storage'

export const MUSIC_VOLUME = 0.35
export const MUSIC_DUCKED = 0.12
export const MUSIC_FADE_MS = 2000
/** How quickly the music comes back up after a line */
export const MUSIC_RECOVER_MS = 400

const FADE_STEP_MS = 50

/** play() returns a promise in browsers; tolerate environments that don't */
const play = (el: HTMLMediaElement): Promise<void> => {
  try {
    return Promise.resolve(el.play())
  } catch (error) {
    return Promise.reject(error)
  }
}

interface SoundApi {
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  startMusic: () => void
  /** Plays a voice line; resolves when it ends with how long it played (ms),
   * or with null if it could not play (sound off, blocked, missing file) */
  playVoice: (url: string) => Promise<number | null>
}

const SoundContext = createContext<SoundApi | null>(null)

export const useSound = (): SoundApi => {
  const value = useContext(SoundContext)
  if (!value) throw new Error('useSound needs a SoundProvider')
  return value
}

interface SoundProviderProps {
  children: ReactNode
  musicSrc?: string
}

// ==========================================
// SOUND — silent until the visitor chooses sound
// ==========================================

export const SoundProvider = ({
  children,
  musicSrc = musicUrl,
}: SoundProviderProps) => {
  const [soundOn, setSoundOnState] = useState(false)
  const soundOnRef = useRef(false)
  const musicWanted = useRef(false)
  const music = useRef<HTMLAudioElement | null>(null)
  const target = useRef(MUSIC_VOLUME)
  const fade = useRef<number | null>(null)
  const voice = useRef<{ el: HTMLAudioElement; finish: () => void } | null>(
    null
  )

  // Ease the music towards its target volume; drops happen at once
  const steer = useCallback((riseMs: number = MUSIC_FADE_MS) => {
    const el = music.current
    if (!el) return
    if (el.volume > target.current) el.volume = target.current
    if (fade.current !== null) window.clearInterval(fade.current)
    fade.current = null
    if (el.volume >= target.current) return
    const step = MUSIC_VOLUME / (riseMs / FADE_STEP_MS)
    fade.current = window.setInterval(() => {
      const next = el.volume + step
      if (next >= target.current - 1e-6) {
        el.volume = target.current
        window.clearInterval(fade.current!)
        fade.current = null
      } else {
        el.volume = next
      }
    }, FADE_STEP_MS)
  }, [])

  const playMusic = useCallback(() => {
    if (!soundOnRef.current || !musicWanted.current || !musicSrc) return
    if (!music.current) {
      const el = new Audio(musicSrc)
      el.loop = true
      el.volume = 0
      music.current = el
    }
    play(music.current).catch(() => {})
    steer()
  }, [musicSrc, steer])

  const stopVoice = useCallback(() => {
    if (!voice.current) return
    voice.current.el.pause()
    voice.current.finish()
  }, [])

  const setSoundOn = useCallback(
    (on: boolean) => {
      soundOnRef.current = on
      setSoundOnState(on)
      setSoundPreference(on ? 'on' : 'off')
      if (on) {
        playMusic()
      } else {
        music.current?.pause()
        stopVoice()
      }
    },
    [playMusic, stopVoice]
  )

  const startMusic = useCallback(() => {
    musicWanted.current = true
    playMusic()
  }, [playMusic])

  const playVoice = useCallback(
    (url: string): Promise<number | null> => {
      if (!soundOnRef.current) return Promise.resolve(null)
      stopVoice()

      return new Promise((resolve) => {
        const el = new Audio(url)
        const started = performance.now()
        let done = false
        const finish = (result: number | null) => {
          if (done) return
          done = true
          if (voice.current?.el === el) voice.current = null
          target.current = MUSIC_VOLUME
          steer(MUSIC_RECOVER_MS)
          resolve(result)
        }

        voice.current = {
          el,
          finish: () => finish(performance.now() - started),
        }
        el.addEventListener('ended', () => finish(performance.now() - started))
        el.addEventListener('error', () => finish(null))

        target.current = MUSIC_DUCKED
        steer()
        play(el).catch(() => finish(null))
      })
    },
    [steer, stopVoice]
  )

  // A hidden tab pauses everything; coming back resumes only the music
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        music.current?.pause()
        stopVoice()
      } else {
        playMusic()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playMusic, stopVoice])

  // Leaving the page: silence and stop the fade
  useEffect(
    () => () => {
      music.current?.pause()
      if (fade.current !== null) window.clearInterval(fade.current)
    },
    []
  )

  const value = useMemo(
    () => ({ soundOn, setSoundOn, startMusic, playVoice }),
    [soundOn, setSoundOn, startMusic, playVoice]
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
