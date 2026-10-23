/**
 * Projects Data
 * One featured project; unfinished work carries a status instead of an image.
 * Screenshots are 1280x800 (16:10) captures of each live site.
 */

import type { Project } from '../types'
import airyonaImage from '../assets/projects/airyona.webp'
import m2aImage from '../assets/projects/m2a-logistics.webp'
import pilot100Image from '../assets/projects/pilot100.webp'
import cabinImage from '../Data/cabin-001.jpg'

export const projects: Project[] = [
  {
    id: 'airyona',
    title: 'Airyona',
    description:
      "Built the full UI for Airyona's pre-launch site, a flight-sharing platform that pairs passengers with licensed private pilots for cost-shared flights. It covers popular routes, how it works, pilot and passenger journeys, an FAQ and the waitlist for the December 2026 launch.",
    tags: ['React', 'Vite', 'Cloudflare'],
    image: airyonaImage,
    imageAlt:
      'Airyona homepage: "Experience the magic of shared flight" beside a small plane above the clouds',
    link: 'https://www.airyona.com/',
    featured: true,
  },
  {
    id: 'm2a-logistics',
    title: 'M2A Logistics',
    description:
      "Built the full UI for a Bremen-based logistics company's website: freight by sea, air, road and rail, warehousing and last-mile delivery, with quote requests and shipment tracking up front.",
    tags: ['Astro', 'TypeScript', 'Cloudflare'],
    image: m2aImage,
    imageAlt:
      'M2A Logistics homepage: "Freight that moves without sitting at a border" over a container port at dusk',
    link: 'https://m2a-logistics.de/',
    github: 'https://github.com/smartchamp25/M2A-Group',
    featured: false,
  },
  {
    id: 'pilot100',
    title: 'Pilot 100',
    description:
      'Enhanced the UI of the learning platform (LMS) behind Pilot 100, an EASA ATPL exam-prep product with 27,000+ practice questions, 13 theory books and an iPhone and iPad app.',
    tags: ['LMS', 'UI'],
    image: pilot100Image,
    imageAlt:
      'Pilot 100 homepage: "Pass first time" beside a sample ATPL exam question',
    link: 'https://pilot100atpl.com/',
    featured: false,
  },
  {
    id: 'wild-oasis',
    title: 'The Wild Oasis',
    description:
      'A luxury cabin resort management system built with React, Vite and Supabase. The admin dashboard runs hotel operations end to end: cabin inventory, guest bookings, check-ins and check-outs, and business analytics through interactive charts and secure authentication.',
    tags: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind', 'Supabase'],
    image: cabinImage,
    imageAlt: 'A warm wooden cabin interior — The Wild Oasis cover image',
    featured: false,
  },
]
