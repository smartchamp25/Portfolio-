import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SITE_URL } from '../constants'
import { sceneForPath, type SceneId } from './scenes'

// Scenes
import Prologue from '../components/sections/Prologue'
import AboutSection from '../components/sections/AboutSection'
import SkillsSection from '../components/sections/SkillsSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import ContactSection from '../components/sections/ContactSection'

// Data files
import { skills, secondarySkills } from '../Data/skills'
import { projects } from '../Data/projects'
import { stats } from '../Data/stats'

interface StageProps {
  onNavigate: (id: SceneId) => void
}

// ==========================================
// STAGE — one scene at a time, chosen by the address
// ==========================================

const Stage = ({ onNavigate }: StageProps) => {
  const { pathname } = useLocation()
  const scene = sceneForPath(pathname)

  // Page title and canonical address follow the scene
  useEffect(() => {
    document.title = scene.title
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    )
    canonical?.setAttribute('href', SITE_URL + scene.path)
  }, [scene])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Prologue scrollToSection={(id) => onNavigate(id as SceneId)} />
        }
      />
      <Route path="/about" element={<AboutSection stats={stats} />} />
      <Route
        path="/skills"
        element={
          <SkillsSection skills={skills} secondarySkills={secondarySkills} />
        }
      />
      <Route
        path="/projects"
        element={<ProjectsSection projects={projects} />}
      />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Stage
