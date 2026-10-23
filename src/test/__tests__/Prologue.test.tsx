/**
 * Prologue tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Prologue from '@/components/sections/Prologue'

describe('Prologue', () => {
  it('sends "View the work" to the projects', () => {
    const onNavigate = vi.fn()
    render(<Prologue onNavigate={onNavigate} />)
    const link = screen.getByRole('link', { name: /View the work/ })
    expect(link).toHaveAttribute('href', '/projects')
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalledWith('projects')
  })

  it('leads into Act I', () => {
    const onNavigate = vi.fn()
    render(<Prologue onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole('button', { name: /Next: Act I/ }))
    expect(onNavigate).toHaveBeenCalledWith('about')
    expect(screen.queryByText('Scroll')).not.toBeInTheDocument()
  })
})
