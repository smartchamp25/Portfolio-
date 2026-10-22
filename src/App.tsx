import { lazy, Suspense } from 'react'
import './App.css'
import { SECTION_IDS } from './constants'

// Custom hooks
import { useScroll, useScrollReveal, useScrollToSection } from './hooks'

// Layout components
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

// Lazy load section components for better performance
const Prologue = lazy(() => import('./components/sections/Prologue'))
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'))
const ProjectsSection = lazy(
  () => import('./components/sections/ProjectsSection')
)
const ContactSection = lazy(
  () => import('./components/sections/ContactSection')
)

// Data files
import { skills, secondarySkills } from './Data/skills'
import { projects } from './Data/projects'
import { stats } from './Data/stats'

// ==========================================
// MAIN APP COMPONENT
// Prologue → Act I (About) → Act II (Skills) → Act III (Projects) → Act IV (Contact)
// ==========================================

function App() {
  const { scrolled, activeSection } = useScroll({
    scrollThreshold: 50,
    sectionIds: SECTION_IDS,
    sectionOffset: 200,
  })

  const { scrollToSection } = useScrollToSection()

  // Scroll reveal animations
  useScrollReveal({ threshold: 96 })

  return (
    <div className="portfolio">
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>

      <Navigation
        scrolled={scrolled}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <main id="main">
        <Suspense fallback={<LoadingSpinner />}>
          <Prologue scrollToSection={scrollToSection} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <AboutSection stats={stats} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SkillsSection skills={skills} secondarySkills={secondarySkills} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <ProjectsSection projects={projects} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default App
