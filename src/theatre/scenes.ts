/**
 * Scenes of the theatre journey: the Prologue and Acts I–IV, in order.
 * Each has its own address, page title, heading to focus and (for acts) a line.
 */

export type SceneId = 'prologue' | 'about' | 'skills' | 'projects' | 'contact'
export type LineId = 'curtain' | 'about' | 'skills' | 'projects' | 'contact'

export interface Scene {
  id: SceneId
  path: string
  label: string
  act?: 'I' | 'II' | 'III' | 'IV'
  title: string
  headingId: string
  line?: LineId
}

export const SCENES: readonly Scene[] = [
  {
    id: 'prologue',
    path: '/',
    label: 'Prologue',
    title: 'Marwan - Frontend Developer | Portfolio',
    headingId: 'prologue-name',
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    act: 'I',
    title: 'Act I · About | Marwan',
    headingId: 'about-title',
    line: 'about',
  },
  {
    id: 'skills',
    path: '/skills',
    label: 'Skills',
    act: 'II',
    title: 'Act II · Skills | Marwan',
    headingId: 'skills-title',
    line: 'skills',
  },
  {
    id: 'projects',
    path: '/projects',
    label: 'Projects',
    act: 'III',
    title: 'Act III · Projects | Marwan',
    headingId: 'projects-title',
    line: 'projects',
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    act: 'IV',
    title: 'Act IV · Contact | Marwan',
    headingId: 'contact-title',
    line: 'contact',
  },
]

/** The scene for an address; unknown addresses fall back to the Prologue */
export const sceneForPath = (pathname: string): Scene => {
  const path =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
  return SCENES.find((s) => s.path === path) ?? SCENES[0]
}

const indexOf = (id: SceneId) => SCENES.findIndex((s) => s.id === id)

export const nextScene = (id: SceneId): Scene | undefined =>
  SCENES[indexOf(id) + 1]

export const previousScene = (id: SceneId): Scene | undefined => {
  const i = indexOf(id)
  return i > 0 ? SCENES[i - 1] : undefined
}
