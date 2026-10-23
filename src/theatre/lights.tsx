/* The provider lives beside its hooks and timings on purpose, like ThemeContext;
   editing this file reloads the page instead of hot-swapping */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../hooks'
import { SCENES, sceneForPath, type SceneId } from './scenes'
import './lights.css'

export const LIGHTS_DOWN_MS = 350
export const SPOTLIGHT_UP_MS = 650
export const REDUCED_FADE_MS = 150

export type LightsPhase = 'idle' | 'down' | 'up'

interface LightsContextValue {
  phase: LightsPhase
  goTo: (id: SceneId) => void
}

const LightsContext = createContext<LightsContextValue | null>(null)

const useLights = (): LightsContextValue => {
  const value = useContext(LightsContext)
  if (!value) throw new Error('Stage lights need a LightsProvider')
  return value
}

/** Move to a scene with the lights-down, spotlight-up change */
export const useGoToScene = (): ((id: SceneId) => void) => useLights().goTo

/** Where the current scene change is: idle, lights down, or spotlight up */
export const useLightsPhase = (): LightsPhase => useLights().phase

// ==========================================
// LIGHTS PROVIDER — runs one scene change at a time
// ==========================================

export const LightsProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<LightsPhase>('idle')
  const [focusId, setFocusId] = useState<string | null>(null)
  const running = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(window.clearTimeout)
  }, [])

  const goTo = useCallback(
    (id: SceneId) => {
      const scene = SCENES.find((s) => s.id === id)
      if (!scene || running.current || sceneForPath(pathname).id === id) return

      running.current = true
      const down = reduced ? REDUCED_FADE_MS / 2 : LIGHTS_DOWN_MS
      const up = reduced ? REDUCED_FADE_MS / 2 : SPOTLIGHT_UP_MS
      setPhase('down')

      timers.current.push(
        window.setTimeout(() => {
          navigate(scene.path)
          window.scrollTo(0, 0)
          setFocusId(scene.headingId)
          setPhase('up')

          timers.current.push(
            window.setTimeout(() => {
              setPhase('idle')
              running.current = false
            }, up)
          )
        }, down)
      )
    },
    [navigate, pathname, reduced]
  )

  // Once the new scene is on stage, move focus to its heading. Navigations run
  // as transitions, so wait until the address has actually changed
  useEffect(() => {
    if (!focusId || sceneForPath(pathname).headingId !== focusId) return
    const heading = document.getElementById(focusId)
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hand-off after the DOM commit
    setFocusId(null)
  }, [pathname, focusId])

  return (
    <LightsContext.Provider value={{ phase, goTo }}>
      {children}
    </LightsContext.Provider>
  )
}

/** The darkness and spotlight drawn over the stage during a scene change */
export const StageLights = () => {
  const phase = useLightsPhase()
  return (
    <div className={'stage-lights stage-lights--' + phase} aria-hidden="true" />
  )
}
