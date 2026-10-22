import { memo } from 'react'
import { ActHeading, SkillCard, Tag } from '../fourth-act'
import type { Skill } from '../../types'
import './SkillsSection.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface SkillsSectionProps {
  skills: Skill[]
  secondarySkills: Skill[]
}

const LEVEL_WORDS = ['', 'Learning', 'Working', 'Proficient', 'Fluent']

// ==========================================
// ACT II — THE ARSENAL
// ==========================================

const SkillsSection = ({ skills, secondarySkills }: SkillsSectionProps) => {
  return (
    <section id="skills" className="act skills" aria-labelledby="skills-title">
      <div className="act__inner">
        <ActHeading
          act="II"
          eyebrow="The Arsenal"
          id="skills-title"
          title={
            <>
              The tools I <em>reach</em> for
            </>
          }
          lead="Four I use every day, and the supporting cast behind them."
        />

        <div className="act__body skills__grid reveal-on-scroll">
          {skills.map((skill) => (
            <SkillCard
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              level={skill.level}
              note={skill.note}
            />
          ))}
        </div>

        <div className="skills__also reveal-on-scroll">
          <p className="skills__also-label">Also in the kit</p>
          <ul className="skills__also-list">
            {secondarySkills.map((skill) => (
              <li key={skill.name}>
                <Tag icon={skill.icon}>
                  {skill.name}
                  <span className="skills__also-level">
                    {' '}
                    · {LEVEL_WORDS[skill.level]}
                  </span>
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default memo(SkillsSection)
