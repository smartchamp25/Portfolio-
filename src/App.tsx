import { useLocation } from 'react-router-dom'
import './App.css'

// Custom hooks
import { useScroll, useScrollReveal } from './hooks'

// Layout components
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'

// The journey
import Stage from './theatre/Stage'
import { LightsProvider, StageLights } from './theatre/lights'
import { useStageNavigate } from './theatre/useStageNavigate'
import { sceneForPath } from './theatre/scenes'

// ==========================================
// THE PERFORMANCE — everything inside the theatre's providers
// ==========================================

const Performance = () => {
  const { scrolled } = useScroll({ scrollThreshold: 50 })
  const { pathname } = useLocation()
  const scene = sceneForPath(pathname)
  const goTo = useStageNavigate()

  // Scroll reveal animations
  useScrollReveal({ threshold: 96 })

  return (
    <div className="portfolio">
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>

      <Navigation active={scene.id} onNavigate={goTo} scrolled={scrolled} />

      <main id="main">
        <Stage onNavigate={goTo} />
      </main>

      <Footer />
      <StageLights />
    </div>
  )
}

// ==========================================
// MAIN APP COMPONENT
// Prologue → Act I (About) → Act II (Skills) → Act III (Projects) → Act IV (Contact),
// each its own scene and address
// ==========================================

function App() {
  return (
    <LightsProvider>
      <Performance />
    </LightsProvider>
  )
}

export default App
