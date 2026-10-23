import { useEffect } from 'react'
import { nextScene, previousScene, type SceneId } from './scenes'

const isTyping = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

/**
 * Left and right arrow keys move between scenes, unless the visitor is
 * typing or holding a modifier key, or the keys are switched off (curtain)
 */
export const useActKeys = (
  current: SceneId,
  onNavigate: (id: SceneId) => void,
  enabled = true
): void => {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return
      if (isTyping(e.target)) return
      const target =
        e.key === 'ArrowRight'
          ? nextScene(current)
          : e.key === 'ArrowLeft'
            ? previousScene(current)
            : undefined
      if (target) onNavigate(target.id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [current, onNavigate, enabled])
}
