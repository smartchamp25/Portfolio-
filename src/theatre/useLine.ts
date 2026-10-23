import { useCallback } from 'react'
import { LINES } from './lines'
import { voiceUrl } from './media'
import type { LineId } from './scenes'
import { useSound } from './sound'
import { hasPlayedLine, markLinePlayed } from './storage'
import { SURTITLE_LINGER_MS, SURTITLE_READ_MS, useSurtitles } from './surtitles'

/** Long enough to outlast any line; replaced as soon as the voice ends */
const UNTIL_VOICE_ENDS_MS = 60_000

/**
 * Speak a line once per visit: always as a surtitle, and in voice when a
 * voice file exists and sound is on
 */
export const useLine = (
  resolveVoice: (id: LineId) => string | undefined = voiceUrl
): ((id: LineId) => void) => {
  const { soundOn, playVoice } = useSound()
  const { show } = useSurtitles()

  return useCallback(
    (id: LineId) => {
      if (hasPlayedLine(id)) return
      markLinePlayed(id)

      const text = LINES[id]
      const url = resolveVoice(id)
      if (!url || !soundOn) {
        show(text, SURTITLE_READ_MS)
        return
      }

      show(text, UNTIL_VOICE_ENDS_MS)
      void playVoice(url).then((played) =>
        show(text, played === null ? SURTITLE_READ_MS : SURTITLE_LINGER_MS)
      )
    },
    [playVoice, resolveVoice, show, soundOn]
  )
}
