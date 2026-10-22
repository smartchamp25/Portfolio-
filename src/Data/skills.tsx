/**
 * Skills Data
 * Four primary skills (the number four) on a four-step scale:
 * 1 Learning · 2 Working · 3 Proficient · 4 Fluent
 */

import type { Skill } from '../types'
import { Atom, Code2, Globe, Wind, Database, GitBranch } from 'lucide-react'

const ICON = { size: 24, strokeWidth: 1.5 } as const

// Primary Skills — always four
export const skills: Skill[] = [
  {
    name: 'React',
    level: 4,
    icon: <Atom {...ICON} />,
    note: 'Components, hooks and state.',
  },
  {
    name: 'JavaScript',
    level: 3,
    icon: <Code2 {...ICON} />,
    note: 'Modern syntax, async and the DOM.',
  },
  {
    name: 'HTML/CSS',
    level: 3,
    icon: <Globe {...ICON} />,
    note: 'Semantic, responsive, accessible.',
  },
  {
    name: 'Tailwind CSS',
    level: 3,
    icon: <Wind {...ICON} />,
    note: 'Utility-first layouts.',
  },
]

// Secondary Skills — the supporting cast
export const secondarySkills: Skill[] = [
  {
    name: 'Supabase',
    level: 2,
    icon: <Database size={14} strokeWidth={1.5} />,
  },
  { name: 'Git', level: 2, icon: <GitBranch size={14} strokeWidth={1.5} /> },
]
