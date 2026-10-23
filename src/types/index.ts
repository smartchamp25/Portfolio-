/**
 * Centralized Type Definitions
 * All shared types used across the portfolio
 */

import type { ReactNode } from 'react'

// ==========================================
// SKILL TYPES
// ==========================================

/** Four-step scale: 1 Learning · 2 Working · 3 Proficient · 4 Fluent */
export type SkillLevel = 1 | 2 | 3 | 4

export interface Skill {
  name: string
  level: SkillLevel
  icon: ReactNode
  /** One line on how you use it (primary skills) */
  note?: string
}

// ==========================================
// PROJECT TYPES
// ==========================================

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  /** Screenshot or cover (16:10). Omit while the project is still in rehearsal. */
  image?: string
  imageAlt?: string
  /** Live demo URL */
  link?: string
  /** Source code URL */
  github?: string
  featured: boolean
  /** Status word for unfinished work, e.g. "In rehearsal" */
  status?: string
}

// ==========================================
// STATS TYPES
// ==========================================

export interface Stat {
  number: string
  label: string
}

// ==========================================
// SOCIAL LINK TYPES
// ==========================================

export interface SocialLink {
  name: string
  url: string
  icon: ReactNode
  ariaLabel?: string
}

// ==========================================
// SECTION PROP TYPES
// ==========================================

export interface AboutSectionProps {
  stats: Stat[]
}

export interface SkillsSectionProps {
  skills: Skill[]
  secondarySkills: Skill[]
}

export interface ProjectsSectionProps {
  projects: Project[]
}
