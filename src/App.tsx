import './App.css'
import { SECTION_IDS } from './constants'

// Custom hooks
import { useScroll, useScrollReveal, useScrollToSection } from './hooks'

// Layout components
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'

// Sections load with the page: each is only a few KB, and lazy-loading them
// made the hero replace a short placeholder and push everything below it down
import Prologue from './components/sections/Prologue'
import AboutSection from './components/sections/AboutSection'
import SkillsSection from './components/sections/SkillsSection'
import ProjectsSection from './components/sections/ProjectsSection'
import ContactSection from './components/sections/ContactSection'

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
        <Prologue scrollToSection={scrollToSection} />
        <AboutSection stats={stats} />
        <SkillsSection skills={skills} secondarySkills={secondarySkills} />
        <ProjectsSection projects={projects} />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

export default App
