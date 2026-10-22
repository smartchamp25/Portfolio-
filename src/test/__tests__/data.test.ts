/**
 * Data Files Tests
 */

import { describe, it, expect } from 'vitest'
import { skills, secondarySkills } from '@/Data/skills'
import { projects } from '@/Data/projects'
import { stats } from '@/Data/stats'

describe('Data Files', () => {
  describe('Skills Data', () => {
    it('has exactly 4 primary skills', () => {
      expect(skills).toHaveLength(4)
    })

    it('has all required skill properties', () => {
      skills.forEach((skill) => {
        expect(skill).toHaveProperty('name')
        expect(skill).toHaveProperty('level')
        expect(skill).toHaveProperty('icon')
        expect(skill.level).toBeGreaterThanOrEqual(1)
        expect(skill.level).toBeLessThanOrEqual(4)
      })
    })

    it('has valid skill names', () => {
      const skillNames = skills.map((s) => s.name)
      expect(skillNames).toContain('React')
      expect(skillNames).toContain('JavaScript')
      expect(skillNames).toContain('HTML/CSS')
      expect(skillNames).toContain('Tailwind CSS')
    })

    it('has exactly 2 secondary skills', () => {
      expect(secondarySkills).toHaveLength(2)
    })
  })

  describe('Projects Data', () => {
    it('has at least one project', () => {
      expect(projects.length).toBeGreaterThanOrEqual(1)
    })

    it('has all required project properties', () => {
      projects.forEach((project) => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('description')
        expect(project).toHaveProperty('tags')
        expect(project).toHaveProperty('featured')
        expect(Array.isArray(project.tags)).toBe(true)
      })
    })

    it('every project has an image or a status', () => {
      projects.forEach((project) => {
        expect(Boolean(project.image) || Boolean(project.status)).toBe(true)
      })
    })

    it('has exactly one featured project', () => {
      const featured = projects.filter((p) => p.featured)
      expect(featured).toHaveLength(1)
    })

    it('featured project is The Wild Oasis', () => {
      const featured = projects.find((p) => p.featured)
      expect(featured?.title).toBe('The Wild Oasis')
    })
  })

  describe('Stats Data', () => {
    it('has exactly 4 stats', () => {
      expect(stats).toHaveLength(4)
    })

    it('has all required stat properties', () => {
      stats.forEach((stat) => {
        expect(stat).toHaveProperty('number')
        expect(stat).toHaveProperty('label')
      })
    })

    it('has expected stat labels', () => {
      const labels = stats.map((s) => s.label)
      expect(labels).toContain('Projects shipped')
      expect(labels).toContain('Tools in daily use')
      expect(labels).toContain('Core skills')
      expect(labels).toContain('The Virtuoso')
    })
  })
})
