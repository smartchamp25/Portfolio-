import { ActHeading, Quote, StatCard } from '../fourth-act'
import LotusTrap from '../ui/LotusTrap'
import type { Stat } from '../../types'
import './AboutSection.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface AboutSectionProps {
  stats: Stat[]
}

// ==========================================
// ACT I — THE CREATOR
// ==========================================

const AboutSection = ({ stats }: AboutSectionProps) => {
  return (
    <section
      id="about"
      className="act act--deep about"
      aria-labelledby="about-title"
    >
      <div className="act__inner">
        <div className="about__grid">
          <ActHeading
            act="I"
            eyebrow="The Creator"
            id="about-title"
            title={
              <>
                Great design, clean <em>code</em>.
              </>
            }
          />

          <div className="about__copy reveal-on-scroll">
            <p className="about__lead">
              I'm <strong>Marwan</strong>, an aspiring frontend developer with a
              passion for creating engaging and intuitive user experiences.
            </p>
            <p>
              I believe that great design combined with clean code can make a
              real difference in how people interact with technology. I'm
              currently expanding my knowledge of modern web technologies,
              focusing on React and on building responsive, accessible
              applications.
            </p>
            <p>
              I'm excited to bring fresh ideas and enthusiasm to a team where I
              can contribute and grow. When I'm not coding, you'll find me
              exploring new design trends and the latest frontend innovations.
            </p>
          </div>
        </div>

        <div className="about__stats reveal-on-scroll">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              index={String(index + 1).padStart(2, '0')}
              value={stat.number}
              label={stat.label}
            />
          ))}
        </div>

        <Quote
          cite="Edsger W. Dijkstra"
          className="about__quote reveal-on-scroll"
          mark={<LotusTrap />}
        >
          Simplicity is prerequisite for reliability.
        </Quote>
      </div>
    </section>
  )
}

export default AboutSection
