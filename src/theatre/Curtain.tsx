/* Timings are exported beside the component for its tests */

import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/fourth-act'
import { usePrefersReducedMotion } from '../hooks'
import { getSoundPreference } from './storage'
import './Curtain.css'

/** The drawn curtain's opening, when there is no video */
export const CURTAIN_OPEN_MS = 3200
/** The push through the parted curtain onto the stage */
export const CURTAIN_FADE_MS = 1200
/** A video curtain starts the push as long before its clip ends as the push
    lasts, so the curtains are still moving until they are gone */
const REVEAL_LEAD_S = CURTAIN_FADE_MS / 1000
/** If a video stalls, open anyway after this long */
const VIDEO_TIMEOUT_MS = 10_000

type Phase = 'closed' | 'opening' | 'fading'

interface CurtainProps {
  /** Called inside the click, so sound can start within the visitor's gesture */
  onEnter: (withSound: boolean) => void
  onSkip: () => void
  /** The stage starts to show through: the push onto it begins */
  onReveal: () => void
  onOpened: () => void
  video?: { src: string; poster?: string }
}

// ==========================================
// CURTAIN — the closed curtain, the choice, and the opening
// ==========================================

const Curtain = ({
  onEnter,
  onSkip,
  onReveal,
  onOpened,
  video,
}: CurtainProps) => {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('closed')
  const [drawn, setDrawn] = useState(!video)
  const [soundFirst] = useState(() => getSoundPreference() !== 'off')
  const videoRef = useRef<HTMLVideoElement>(null)
  const timers = useRef<number[]>([])
  const opened = useRef(false)

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const finish = () => {
    if (opened.current) return
    opened.current = true
    setPhase('fading')
    onReveal()
    later(onOpened, CURTAIN_FADE_MS)
  }

  const openDrawn = () => {
    setDrawn(true)
    later(finish, CURTAIN_OPEN_MS)
  }

  // The page behind stays still while the curtain is down
  useEffect(() => {
    const pending = timers.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      pending.forEach(window.clearTimeout)
    }
  }, [])

  const choose = (withSound: boolean) => {
    onEnter(withSound)
    if (reduced) {
      opened.current = true
      onOpened()
      return
    }
    setPhase('opening')
    const el = videoRef.current
    if (!video || !el) {
      openDrawn()
      return
    }
    el.addEventListener('timeupdate', () => {
      if (el.duration - el.currentTime <= REVEAL_LEAD_S) finish()
    })
    el.addEventListener('ended', finish, { once: true })
    later(finish, VIDEO_TIMEOUT_MS)
    Promise.resolve(el.play()).catch(openDrawn)
  }

  const seat = (
    <Button
      key="seat"
      variant={soundFirst ? 'primary' : 'ghost'}
      size="lg"
      onClick={() => choose(true)}
      autoFocus={soundFirst}
    >
      Take your seat
    </Button>
  )
  const silent = (
    <Button
      key="silent"
      variant={soundFirst ? 'ghost' : 'primary'}
      size="lg"
      onClick={() => choose(false)}
      autoFocus={!soundFirst}
    >
      Enter without sound
    </Button>
  )

  return (
    <div
      className={`curtain curtain--${phase}${drawn ? ' curtain--drawn' : ''}`}
      data-theme="dark"
    >
      {video ? (
        <video
          ref={videoRef}
          className="curtain__video"
          src={video.src}
          poster={video.poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      ) : null}

      <div className="curtain__drape curtain__drape--left" aria-hidden="true" />
      <div
        className="curtain__drape curtain__drape--right"
        aria-hidden="true"
      />
      <div className="curtain__valance" aria-hidden="true" />

      <div className="curtain__playbill">
        <p className="curtain__eyebrow">Tonight’s performance</p>
        <p className="curtain__name">Marwan</p>
        <p className="curtain__role">Frontend developer</p>
        <div className="curtain__actions">
          {soundFirst ? [seat, silent] : [silent, seat]}
        </div>
        <Button variant="quiet" onClick={onSkip}>
          Skip intro
        </Button>
      </div>
    </div>
  )
}

export default Curtain
