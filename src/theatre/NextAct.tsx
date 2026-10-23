import { ArrowRight } from 'lucide-react'
import { Button } from '../components/fourth-act'
import { SCENES, nextScene, type SceneId } from './scenes'
import './NextAct.css'

interface NextActProps {
  current: SceneId
  onNavigate: (id: SceneId) => void
}

// ==========================================
// NEXT ACT — the way forward at the end of every scene
// ==========================================

const NextAct = ({ current, onNavigate }: NextActProps) => {
  const next = nextScene(current)
  const target = next ?? SCENES[0]

  return (
    <nav className="next-act" aria-label="Next scene">
      <Button
        href={target.path}
        onClick={(e) => {
          e.preventDefault()
          onNavigate(target.id)
        }}
        iconEnd={next ? <ArrowRight size={20} strokeWidth={1.5} /> : undefined}
      >
        {next ? 'Next act' : 'Back to the beginning'}
      </Button>
    </nav>
  )
}

export default NextAct
