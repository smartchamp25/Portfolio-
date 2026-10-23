/**
 * What the journey remembers. Curtain and lines last for the browser session;
 * the sound choice is kept between visits. Storage can be blocked (private
 * windows, cleared site data), so every access falls back quietly.
 */

import type { LineId } from './scenes'

export type SoundPreference = 'on' | 'off'

const CURTAIN_KEY = 'theatre:curtain-seen'
const SOUND_KEY = 'theatre:sound'
const lineKey = (id: LineId) => `theatre:line:${id}`

const read = (store: () => Storage, key: string): string | null => {
  try {
    return store().getItem(key)
  } catch {
    return null
  }
}

const write = (store: () => Storage, key: string, value: string): void => {
  try {
    store().setItem(key, value)
  } catch {
    // Storage unavailable: the journey simply won't remember this
  }
}

const session = () => window.sessionStorage
const local = () => window.localStorage

export const hasSeenCurtain = (): boolean => read(session, CURTAIN_KEY) === '1'

export const markCurtainSeen = (): void => write(session, CURTAIN_KEY, '1')

export const hasPlayedLine = (id: LineId): boolean =>
  read(session, lineKey(id)) === '1'

export const markLinePlayed = (id: LineId): void =>
  write(session, lineKey(id), '1')

export const getSoundPreference = (): SoundPreference | null => {
  const value = read(local, SOUND_KEY)
  return value === 'on' || value === 'off' ? value : null
}

export const setSoundPreference = (p: SoundPreference): void =>
  write(local, SOUND_KEY, p)
