/**
 * Journey storage tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  hasSeenCurtain,
  markCurtainSeen,
  hasPlayedLine,
  markLinePlayed,
  getSoundPreference,
  setSoundPreference,
} from '@/theatre/storage'

describe('journey storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('remembers the curtain for the session', () => {
    expect(hasSeenCurtain()).toBe(false)
    markCurtainSeen()
    expect(hasSeenCurtain()).toBe(true)
    expect(sessionStorage.getItem('theatre:curtain-seen')).toBe('1')
  })

  it('tracks played lines per id', () => {
    markLinePlayed('about')
    expect(hasPlayedLine('about')).toBe(true)
    expect(hasPlayedLine('skills')).toBe(false)
  })

  it('stores the sound preference', () => {
    expect(getSoundPreference()).toBeNull()
    setSoundPreference('off')
    expect(getSoundPreference()).toBe('off')
    expect(localStorage.getItem('theatre:sound')).toBe('off')
  })

  it('survives storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(() => markCurtainSeen()).not.toThrow()
    expect(() => markLinePlayed('about')).not.toThrow()
    expect(() => setSoundPreference('on')).not.toThrow()
    expect(hasSeenCurtain()).toBe(false)
    expect(hasPlayedLine('about')).toBe(false)
    expect(getSoundPreference()).toBeNull()
  })
})
