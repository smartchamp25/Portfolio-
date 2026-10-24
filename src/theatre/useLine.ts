import { useCallback } from 'react'
import { voiceUrl } from './media'
import type { LineId } from './scenes'
import { useSound } from './sound'
import { hasPlayedLine, markLinePlayed } from './storage'

/**
 * Speak a line in voice, once per visit, the first time it can be heard:
 * when its voice file exists and sound is on. Nothing is shown on screen
 */
export const useLine = (
  resolveVoice: (id: LineId) => string | undefined = voiceUrl
): ((id: LineId) => void) => {
  const { isSoundOn, playVoice } = useSound()

  return useCallback(
    (id: LineId) => {
      const url = resolveVoice(id)
      // Read the live sound state: it may have been switched on in this click
      if (!url || !isSoundOn() || hasPlayedLine(id)) return
      markLinePlayed(id)
      void playVoice(url)
    },
    [isSoundOn, playVoice, resolveVoice]
  )
}
