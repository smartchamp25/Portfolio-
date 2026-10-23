import { Volume2, VolumeX } from 'lucide-react'
import { IconButton } from '../components/fourth-act'
import { useSound } from './sound'

// ==========================================
// SOUND TOGGLE — in the top bar on every scene
// ==========================================

const SoundToggle = () => {
  const { soundOn, setSoundOn } = useSound()

  return (
    <IconButton
      size="sm"
      label={soundOn ? 'Turn sound off' : 'Turn sound on'}
      onClick={() => setSoundOn(!soundOn)}
    >
      {soundOn ? (
        <Volume2 size={16} strokeWidth={1.5} />
      ) : (
        <VolumeX size={16} strokeWidth={1.5} />
      )}
    </IconButton>
  )
}

export default SoundToggle
