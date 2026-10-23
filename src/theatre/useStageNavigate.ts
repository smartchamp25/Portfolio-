import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SCENES, type SceneId } from './scenes'

/** Move to a scene by id */
export const useStageNavigate = (): ((id: SceneId) => void) => {
  const navigate = useNavigate()
  return useCallback(
    (id: SceneId) => {
      const scene = SCENES.find((s) => s.id === id)
      if (scene) navigate(scene.path)
    },
    [navigate]
  )
}
