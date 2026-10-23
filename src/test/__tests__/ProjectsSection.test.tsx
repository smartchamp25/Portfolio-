/**
 * Projects Section Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectsSection from '@/components/sections/ProjectsSection'
import { projects } from '@/Data/projects'

describe('ProjectsSection Component', () => {
  const mockProps = {
    projects,
  }

  it('renders the act heading', () => {
    render(<ProjectsSection {...mockProps} />)
    expect(screen.getByText('Act III')).toBeInTheDocument()
    expect(screen.getByText('The Masterpieces')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /curtain call/ })
    ).toBeInTheDocument()
  })

  it('renders all projects', () => {
    render(<ProjectsSection {...mockProps} />)
    projects.forEach((project) => {
      expect(
        screen.getByRole('heading', { level: 3, name: project.title })
      ).toBeInTheDocument()
    })
  })

  it('renders the featured project with its badge', () => {
    render(<ProjectsSection {...mockProps} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByAltText(/Airyona/)).toBeInTheDocument()
  })

  it('shows status instead of an image for unfinished work', () => {
    const draft = {
      id: 'draft',
      title: 'Draft',
      description: 'Still being built.',
      tags: [],
      status: 'In rehearsal',
      featured: false,
    }
    render(<ProjectsSection projects={[...projects, draft]} />)
    expect(screen.getByText('In rehearsal')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(projects.length)
  })

  it('renders project tags', () => {
    render(<ProjectsSection {...mockProps} />)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Supabase')).toBeInTheDocument()
  })

  it('links only to real URLs', () => {
    render(<ProjectsSection {...mockProps} />)
    const live = screen.getAllByRole('link', { name: /Live demo/ })
    expect(live).toHaveLength(projects.filter((p) => p.link).length)
    live.forEach((a) =>
      expect(a).toHaveAttribute('href', expect.stringMatching(/^https:\/\//))
    )
    screen
      .getAllByRole('link', { name: /Source/ })
      .forEach((a) =>
        expect(a).toHaveAttribute('href', expect.stringContaining('github.com'))
      )
  })

  it('hides links a project does not have', () => {
    render(
      <ProjectsSection
        projects={[{ ...projects[0], link: '#', github: undefined }]}
      />
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('has proper section structure', () => {
    const { container } = render(<ProjectsSection {...mockProps} />)
    expect(container.querySelector('section#projects')).toBeInTheDocument()
  })
})
