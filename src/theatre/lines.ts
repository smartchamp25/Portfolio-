/**
 * The spoken lines: the opening as the curtain rises, then one per act.
 * Voice files, when present, are named after the line id.
 */

import type { LineId } from './scenes'

export const LINES: Record<LineId, string> = {
  curtain: 'And now… the curtain rises.',
  about: 'Every masterpiece… begins with a single stroke.',
  skills: 'Each instrument… chosen with care.',
  projects: 'Behold. The work… speaks for itself.',
  contact: 'Every performance… deserves an encore.',
}
