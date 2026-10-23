// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

export const GITHUB_URL =
  import.meta.env.VITE_GITHUB_URL || 'https://github.com/smartchamp25'
export const EMAIL = import.meta.env.VITE_EMAIL || 'smartchampmarwan@gmail.com'
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/marwan-smartchamp-1748b8383/'

/** The live site's address; placeholder until the real domain is known */
export const SITE_URL = 'https://yourportfolio.vercel.app'

// ==========================================
// APPLICATION CONSTANTS
// ==========================================

/**
 * Main navigation sections of the portfolio
 * Ordered as they appear in the navigation menu
 */
export const SECTIONS = ['About', 'Skills', 'Projects', 'Contact'] as const

/**
 * Section IDs matching HTML element IDs
 * Used for scroll navigation and active section tracking
 */
export const SECTION_IDS = [
  'prologue',
  'about',
  'skills',
  'projects',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/**
 * Social media links for the portfolio
 * Update these URLs with your actual profile links
 */
export const SOCIAL_LINKS = {
  github: 'https://github.com/smartchamp25',
  linkedin: 'https://linkedin.com/in/marwan-smartchamp-1748b8383',
  twitter: 'https://twitter.com',
} as const

/**
 * Section sizes: four primary skills, four stats
 */
export const PRIMARY_SKILLS_COUNT = 4
export const STATS_COUNT = 4
