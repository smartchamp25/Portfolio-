import { ArrowRight, Mail } from 'lucide-react'
import { Badge, Button, Icon, IconButton, Star } from '../fourth-act'
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../constants'
import type { SceneId } from '../../theatre/scenes'
import './Prologue.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface PrologueProps {
  onNavigate: (id: SceneId) => void
}

const STAR_PATH =
  'M12 0A16 16 0 0 0 24 12A16 16 0 0 0 12 24A16 16 0 0 0 0 12A16 16 0 0 0 12 0Z'

// ==========================================
// ORBIT — abstract stage art: chrome rings, two arcs, the outline star
// ==========================================

const Orbit = () => (
  <div className="prologue__orbit fa-rise" aria-hidden="true">
    <svg viewBox="0 0 440 440">
      <g className="prologue__spin">
        <circle
          className="orbit-ring orbit-ring--4"
          cx="220"
          cy="220"
          r="212"
        />
        <circle
          className="orbit-ring orbit-ring--3"
          cx="220"
          cy="220"
          r="168"
        />
        <circle
          className="orbit-ring orbit-ring--2"
          cx="220"
          cy="220"
          r="124"
        />
        <circle className="orbit-ring orbit-ring--1" cx="220" cy="220" r="80" />
        <path
          className="orbit-arc orbit-arc--crimson"
          d="M277.5 62.1A168 168 0 0 1 388 220"
        />
        <path
          className="orbit-arc orbit-arc--violet"
          d="M177.6 336.5A124 124 0 0 1 103.5 177.6"
        />
        <circle className="orbit-dot--crimson" cx="388" cy="220" r="4" />
        <circle className="orbit-dot--violet" cx="103.5" cy="177.6" r="4" />
        <circle className="orbit-dot--chrome" cx="46.3" cy="98.4" r="4" />
      </g>
      <path
        className="orbit-spark"
        vectorEffect="non-scaling-stroke"
        transform="translate(172 172) scale(4)"
        d={STAR_PATH}
      />
      <circle className="orbit-dot--ink" cx="220" cy="220" r="2" />
    </svg>
  </div>
)

// ==========================================
// PROLOGUE — the hero
// ==========================================

const Prologue = ({ onNavigate }: PrologueProps) => {
  return (
    <section
      id="prologue"
      className="prologue fa-stage"
      aria-labelledby="prologue-name"
    >
      <div className="prologue__spot" aria-hidden="true" />

      <div className="prologue__main">
        <div className="prologue__copy">
          <div className="fa-rise">
            <Badge tone="live">Available for opportunities</Badge>
          </div>

          <p className="prologue__eyebrow fa-rise prologue__d1">
            <b>Prologue</b>
            <span className="prologue__rule" aria-hidden="true" />
            Frontend developer
          </p>

          <h1 className="prologue__name" id="prologue-name">
            <span className="fa-curtain">Marwan</span>
            <Star size={28} glow />
          </h1>

          <p className="prologue__tagline fa-rise prologue__d2">
            Crafting <em>beautiful</em>, responsive and user-friendly web
            experiences that leave a lasting impression.
          </p>

          <div className="prologue__actions fa-rise prologue__d3">
            <Button
              variant="primary"
              size="lg"
              href="/projects"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('projects')
              }}
              iconEnd={<ArrowRight size={20} strokeWidth={1.5} />}
            >
              View the work
            </Button>
            <Button
              size="lg"
              href={`mailto:${EMAIL}`}
              icon={<Mail size={20} strokeWidth={1.5} />}
            >
              Contact me
            </Button>
          </div>

          <div className="prologue__social fa-rise prologue__d4">
            <span>Elsewhere</span>
            <IconButton
              size="sm"
              label="Visit GitHub profile"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size={16} />
            </IconButton>
            <IconButton
              size="sm"
              label="Visit LinkedIn profile"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="linkedin" size={16} />
            </IconButton>
          </div>
        </div>

        <Orbit />
      </div>

      <div className="prologue__cue fa-rise prologue__d4">
        <button type="button" onClick={() => onNavigate('about')}>
          Next: Act I
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
        <span>The Creator</span>
      </div>
    </section>
  )
}

export default Prologue
