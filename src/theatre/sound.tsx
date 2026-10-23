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
/** How quickly the music dips under a line */
const MUSIC_DUCK_MS = 150

const FADE_STEP_MS = 50

/** A silent clip played inside the visitor's click, so iOS lets the same
 * player speak later lines without another tap */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

/** play() returns a promise in browsers; tolerate environments that don't */
const play = (el: HTMLMediaElement): Promise<void> => {
  try {
    return Promise.resolve(el.play())
  } catch (error) {
    return Promise.reject(error)
  }
}

type AudioContextClass = typeof AudioContext

const audioContextClass = (): AudioContextClass | undefined =>
  window.AudioContext ??
  (window as unknown as { webkitAudioContext?: AudioContextClass })
    .webkitAudioContext

interface SoundApi {
  soundOn: boolean
  /** The live value, for callbacks that run in the same click that changed it */
  isSoundOn: () => boolean
  /** Call inside the visitor's click: it also unlocks audio for later */
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
// SOUND — silent until the visitor chooses sound. Where Web Audio exists the
// music's level runs through a gain node (iOS ignores element volume); the
// players are unlocked inside the click that turns sound on, so timers can
// start them later
// ==========================================

export const SoundProvider = ({
  children,
  musicSrc = musicUrl,
}: SoundProviderProps) => {
  const [soundOn, setSoundOnState] = useState(false)
  const soundOnRef = useRef(false)
  const musicWanted = useRef(false)
  const ctx = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const music = useRef<HTMLAudioElement | null>(null)
  const voicePlayer = useRef<HTMLAudioElement | null>(null)
  const target = useRef(MUSIC_VOLUME)
  const fade = useRef<number | null>(null)
  const voice = useRef<{ el: HTMLAudioElement; finish: () => void } | null>(
    null
  )

  // Without Web Audio: ease the element volume towards its target
  const steer = useCallback((riseMs: number) => {
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

  /** Move the music to `level` over `ms` */
  const setLevel = useCallback(
    (level: number, ms: number) => {
      target.current = level
      const node = gain.current
      if (node && ctx.current) {
        const now = ctx.current.currentTime
        node.gain.cancelScheduledValues(now)
        node.gain.setValueAtTime(node.gain.value, now)
        node.gain.linearRampToValueAtTime(level, now + ms / 1000)
      } else {
        steer(ms)
      }
    },
    [steer]
  )

  const ensureMusic = useCallback((): HTMLAudioElement | null => {
    if (!musicSrc) return null
    if (music.current) return music.current
    const el = new Audio(musicSrc)
    el.loop = true
    const context = ctx.current
    if (context) {
      const node = context.createGain()
      node.gain.value = 0
      context.createMediaElementSource(el).connect(node)
      node.connect(context.destination)
      gain.current = node
    } else {
      el.volume = 0
    }
    music.current = el
    return el
  }, [musicSrc])

  const playMusic = useCallback(() => {
    if (!soundOnRef.current || !musicWanted.current) return
    const el = ensureMusic()
    if (!el) return
    void ctx.current?.resume().catch(() => {})
    play(el).catch(() => {})
    setLevel(voice.current ? MUSIC_DUCKED : MUSIC_VOLUME, MUSIC_FADE_MS)
  }, [ensureMusic, setLevel])

  // Inside the click that turns sound on: open Web Audio and let both players
  // play once, so later timer-started playback is allowed
  const unlock = useCallback(() => {
    const Context = audioContextClass()
    if (Context && !ctx.current) {
      try {
        ctx.current = new Context()
      } catch {
        ctx.current = null
      }
    }
    void ctx.current?.resume().catch(() => {})

    const player = (voicePlayer.current ??= new Audio())
    if (!voice.current) {
      player.src = SILENT_WAV
      play(player)
        .then(() => {
          if (!voice.current) player.pause()
        })
        .catch(() => {})
    }

    const el = ensureMusic()
    if (el && !musicWanted.current) {
      play(el)
        .then(() => {
          if (!musicWanted.current) el.pause()
        })
        .catch(() => {})
    }
  }, [ensureMusic])

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
        unlock()
        playMusic()
      } else {
        music.current?.pause()
        stopVoice()
      }
    },
    [playMusic, stopVoice, unlock]
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
        const el = (voicePlayer.current ??= new Audio())
        const started = performance.now()
        let done = false
        const onEnded = () => finish(performance.now() - started)
        const onError = () => finish(null)
        const finish = (result: number | null) => {
          if (done) return
          done = true
          el.removeEventListener('ended', onEnded)
          el.removeEventListener('error', onError)
          if (voice.current?.el === el) voice.current = null
          setLevel(MUSIC_VOLUME, MUSIC_RECOVER_MS)
          resolve(result)
        }

        voice.current = { el, finish: onEnded }
        el.addEventListener('ended', onEnded)
        el.addEventListener('error', onError)
        el.src = url

        setLevel(MUSIC_DUCKED, MUSIC_DUCK_MS)
        play(el).catch(() => finish(null))
      })
    },
    [setLevel, stopVoice]
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
      void ctx.current?.close?.().catch(() => {})
    },
    []
  )

  const isSoundOn = useCallback(() => soundOnRef.current, [])

  const value = useMemo(
    () => ({ soundOn, isSoundOn, setSoundOn, startMusic, playVoice }),
    [soundOn, isSoundOn, setSoundOn, startMusic, playVoice]
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
