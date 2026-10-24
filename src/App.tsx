import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'

// Custom hooks
import { useScroll, useScrollReveal } from './hooks'

// Layout components
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'

// The journey
import Stage from './theatre/Stage'
import Curtain from './theatre/Curtain'
import { LightsProvider, StageLights } from './theatre/lights'
import { SoundProvider, useSound } from './theatre/sound'
import { useStageNavigate } from './theatre/useStageNavigate'
import { useLine } from './theatre/useLine'
import { curtainVideo } from './theatre/media'
import { sceneForPath } from './theatre/scenes'
import { hasSeenCurtain, markCurtainSeen } from './theatre/storage'

// ==========================================
// THE PERFORMANCE — everything inside the theatre's providers
// ==========================================

const Performance = () => {
  const { scrolled } = useScroll({ scrollThreshold: 50 })
  const { pathname } = useLocation()
  const scene = sceneForPath(pathname)
  const goTo = useStageNavigate()
  const { setSoundOn, startMusic } = useSound()
  const say = useLine()

  // The curtain greets a first visit to the home page, once per session
  const [curtain, setCurtain] = useState(
    () => pathname === '/' && !hasSeenCurtain()
  )
  // The stage stays dark and still until the curtain reveals it
  const [revealed, setRevealed] = useState(false)
  const closed = curtain && !revealed

  // Music is wanted whenever the stage is open (it plays once sound is on)
  useEffect(() => {
    if (!curtain) startMusic()
  }, [curtain, startMusic])

  // Scroll reveal animations
  useScrollReveal({ threshold: 96 })

  const enter = (withSound: boolean) => {
    setSoundOn(withSound)
    markCurtainSeen()
    say('curtain')
  }

  const skip = () => {
    markCurtainSeen()
    setCurtain(false)
  }

  return (
    <div className={closed ? 'portfolio portfolio--curtained' : 'portfolio'}>
      {/* First in the page, so the keyboard reaches it before anything else */}
      {curtain ? (
        <Curtain
          onEnter={enter}
          onSkip={skip}
          onReveal={() => setRevealed(true)}
          onOpened={() => setCurtain(false)}
          video={curtainVideo}
        />
      ) : null}

      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>

      <Navigation
        active={scene.id}
        onNavigate={goTo}
        scrolled={scrolled}
        hidden={closed}
      />

      <main id="main" inert={closed}>
        <Stage onNavigate={goTo} keysEnabled={!curtain} />
      </main>

      <Footer />

      <StageLights />
    </div>
  )
}

// ==========================================
// MAIN APP COMPONENT
// Curtain → Prologue → Act I (About) → Act II (Skills) → Act III (Projects)
// → Act IV (Contact), each its own scene and address
// ==========================================

function App() {
  return (
    <SoundProvider>
      <LightsProvider>
        <Performance />
      </LightsProvider>
    </SoundProvider>
  )
}

export default App
