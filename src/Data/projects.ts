/**
 * Projects Data
 * One featured project; unfinished work carries a status instead of an image.
 */

import type { Project } from '../types'
import { GITHUB_URL } from '../constants'
import cabinImage from '../Data/cabin-001.jpg'

export const projects: Project[] = [
  {
    id: 'wild-oasis',
    title: 'The Wild Oasis',
    description:
      'A luxury cabin resort management system built with React, Vite and Supabase. The admin dashboard runs hotel operations end to end: cabin inventory, guest bookings, check-ins and check-outs, and business analytics through interactive charts and secure authentication.',
    tags: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind', 'Supabase'],
    image: cabinImage,
    imageAlt: 'A warm wooden cabin interior — The Wild Oasis cover image',
    github: GITHUB_URL,
    featured: true,
  },
  {
    id: 'next-act',
    title: 'The next act',
    description: 'In production now. The curtain rises when it is ready.',
    tags: ['React', 'TypeScript'],
    status: 'In rehearsal',
    featured: false,
  },
  {
    id: 'untitled',
    title: 'Untitled',
    description:
      'An idea being blocked out on paper before the first line of code.',
    tags: ['Concept'],
    status: 'Planning',
    featured: false,
  },
]
