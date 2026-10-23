/* The provider lives beside its hook and timings on purpose, like ThemeContext;
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
import './surtitles.css'

/** How long a surtitle stays after its voice ends */
export const SURTITLE_LINGER_MS = 1000
/** How long a surtitle stays when there is no voice */
export const SURTITLE_READ_MS = 3500

interface SurtitlesApi {
  /** Show `text` for `ms`; calling again replaces the text and the timer.
   * Returns a token for this surtitle */
  show: (text: string, ms: number) => number
  /** Re-time the surtitle shown with `token` to clear `ms` from now; does
   * nothing if another surtitle has replaced it since */
  extend: (token: number, ms: number) => void
}

interface SurtitleState {
  text: string | null
}

const ApiContext = createContext<SurtitlesApi | null>(null)
const TextContext = createContext<SurtitleState>({ text: null })

export const useSurtitles = (): SurtitlesApi => {
  const value = useContext(ApiContext)
  if (!value) throw new Error('useSurtitles needs a SurtitleProvider')
  return value
}

export const SurtitleProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const current = useRef(0)

  const clearAfter = useCallback((ms: number) => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setText(null)
      timer.current = null
    }, ms)
  }, [])

  const show = useCallback(
    (next: string, ms: number) => {
      current.current += 1
      setText(next)
      clearAfter(ms)
      return current.current
    },
    [clearAfter]
  )

  const extend = useCallback(
    (token: number, ms: number) => {
      if (token === current.current) clearAfter(ms)
    },
    [clearAfter]
  )

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    []
  )

  const api = useMemo(() => ({ show, extend }), [show, extend])
  const state = useMemo(() => ({ text }), [text])

  return (
    <ApiContext.Provider value={api}>
      <TextContext.Provider value={state}>{children}</TextContext.Provider>
    </ApiContext.Provider>
  )
}

// ==========================================
// SURTITLES — the spoken line, as text, like a theatre's surtitle board
// ==========================================

export const Surtitles = () => {
  const { text } = useContext(TextContext)
  return (
    <div className="surtitles" aria-live="polite">
      {text ? (
        <p key={text} className="surtitles__line">
          {text}
        </p>
      ) : null}
    </div>
  )
}
