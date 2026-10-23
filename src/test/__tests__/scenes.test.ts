/**
 * Scene registry tests
 */

import { describe, it, expect } from 'vitest'
import {
  SCENES,
  sceneForPath,
  nextScene,
  previousScene,
} from '@/theatre/scenes'

describe('scenes', () => {
  it('lists the five scenes in journey order', () => {
    expect(SCENES.map((s) => s.path)).toEqual([
      '/',
      '/about',
      '/skills',
      '/projects',
      '/contact',
    ])
  })

  it('finds a scene by path, tolerating a trailing slash', () => {
    expect(sceneForPath('/projects').id).toBe('projects')
    expect(sceneForPath('/skills/').id).toBe('skills')
  })

  it('falls back to the prologue for unknown paths', () => {
    expect(sceneForPath('/nope').id).toBe('prologue')
  })

  it('steps forward and back', () => {
    expect(nextScene('prologue')?.id).toBe('about')
    expect(nextScene('contact')).toBeUndefined()
    expect(previousScene('about')?.id).toBe('prologue')
    expect(previousScene('prologue')).toBeUndefined()
  })

  it('gives each act a line and heading', () => {
    const about = SCENES.find((s) => s.id === 'about')
    expect(about?.line).toBe('about')
    expect(about?.headingId).toBe('about-title')
    expect(SCENES.find((s) => s.act === 'II')?.id).toBe('skills')
    expect(SCENES.find((s) => s.id === 'prologue')?.line).toBeUndefined()
  })
})
