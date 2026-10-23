/**
 * Media discovery tests
 */

import { describe, it, expect } from 'vitest'
import { pickFile } from '@/theatre/media'

describe('pickFile', () => {
  it('picks a file by basename', () => {
    expect(pickFile({ '/src/assets/voice/about.mp3': '/a.mp3' }, 'about')).toBe(
      '/a.mp3'
    )
    expect(pickFile({}, 'about')).toBeUndefined()
    expect(pickFile({ '/x/about-2.mp3': 'y' }, 'about')).toBeUndefined()
  })
})
