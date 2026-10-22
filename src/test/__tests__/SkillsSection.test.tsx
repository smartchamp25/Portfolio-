/**
 * Skills Section Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillsSection from '@/components/sections/SkillsSection'
import { skills, secondarySkills } from '@/Data/skills'

describe('SkillsSection Component', () => {
  const mockProps = {
    skills,
    secondarySkills,
  }

  it('renders the act heading', () => {
    render(<SkillsSection {...mockProps} />)
    expect(screen.getByText('Act II')).toBeInTheDocument()
    expect(screen.getByText('The Arsenal')).toBeInTheDocument()
  })

  it('renders all primary skills', () => {
    render(<SkillsSection {...mockProps} />)
    expect(screen.getByRole('heading', { name: 'React' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'JavaScript' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'HTML/CSS' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Tailwind CSS' })
    ).toBeInTheDocument()
  })

  it('shows levels as words on a four-notch scale, not percentages', () => {
    const { container } = render(<SkillsSection {...mockProps} />)
    expect(screen.getByLabelText('Fluent, level 4 of 4')).toBeInTheDocument()
    expect(
      screen.getAllByLabelText(/Proficient, level 3 of 4/).length
    ).toBeGreaterThan(0)
    expect(container.querySelectorAll('.fa-skill__notch')).toHaveLength(
      skills.length * 4
    )
    expect(container.textContent).not.toMatch(/\d+%/)
  })

  it('renders all secondary skills', () => {
    render(<SkillsSection {...mockProps} />)
    expect(screen.getByText(/Supabase/)).toBeInTheDocument()
    expect(screen.getByText(/^Git/)).toBeInTheDocument()
  })

  it('has proper section structure for accessibility', () => {
    const { container } = render(<SkillsSection {...mockProps} />)
    expect(container.querySelector('section#skills')).toBeInTheDocument()
  })
})
