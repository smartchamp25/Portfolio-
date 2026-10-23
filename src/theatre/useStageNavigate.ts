import type { SceneId } from './scenes'
import { useGoToScene } from './lights'

/** Move to a scene by id, through the stage lights */
export const useStageNavigate = (): ((id: SceneId) => void) => useGoToScene()
