/**
 * Stats Data
 * Always four. The first three are counted from the data files, so they stay
 * true as projects and skills change; re-check the Lighthouse score after big
 * changes.
 */

import type { Stat } from '../types'
import { projects } from './projects'
import { skills, secondarySkills } from './skills'

// A project with a status is still in progress
const built = projects.filter((p) => !p.status).length

export const stats: Stat[] = [
  {
    number: String(built),
    label: built === 1 ? 'Project built' : 'Projects built',
  },
  {
    number: String(skills.length + secondarySkills.length),
    label: 'Tools I work with',
  },
  { number: String(skills.length), label: 'Core skills' },
  { number: '100', label: 'Lighthouse accessibility' },
]
