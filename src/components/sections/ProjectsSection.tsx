import { ActHeading, ProjectCard } from '../fourth-act'
import type { Project } from '../../types'
import './ProjectsSection.css'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface ProjectsSectionProps {
  projects: Project[]
}

/** Only pass real URLs — placeholder '#' links stay hidden */
const realUrl = (url?: string) => (url && url !== '#' ? url : undefined)

// ==========================================
// ACT III — THE MASTERPIECES
// ==========================================

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const featured = projects.find((p) => p.featured)
  const rest = projects.filter((p) => p !== featured)

  const card = (project: Project, index: number) => (
    <ProjectCard
      key={project.id}
      index={String(index + 1).padStart(2, '0')}
      title={project.title}
      description={project.description}
      tags={project.tags}
      image={project.image}
      imageAlt={project.imageAlt}
      featured={project.featured}
      status={project.status}
      href={realUrl(project.link)}
      repo={realUrl(project.github)}
    />
  )

  return (
    <section
      id="projects"
      className="act act--deep projects"
      aria-labelledby="projects-title"
    >
      <div className="act__inner">
        <ActHeading
          act="III"
          eyebrow="The Masterpieces"
          id="projects-title"
          title={
            <>
              Work that earns its <em>curtain call</em>
            </>
          }
          lead="A small, deliberate repertoire — each piece built end to end."
        />

        <div className="act__body projects__list">
          {featured ? (
            <div className="reveal-on-scroll">{card(featured, 0)}</div>
          ) : null}
          {rest.length ? (
            <div className="projects__grid reveal-on-scroll">
              {rest.map((project, i) => card(project, i + (featured ? 1 : 0)))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
