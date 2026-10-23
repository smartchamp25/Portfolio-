/**
 * Navigation Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '@/components/layout/Navigation'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SoundProvider } from '@/theatre/sound'

// Wrapper to provide theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SoundProvider>{children}</SoundProvider>
  </ThemeProvider>
)

describe('Navigation Component', () => {
  const mockProps = {
    active: 'prologue' as const,
    onNavigate: vi.fn(),
    scrolled: false,
  }

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper })
  }

  it('renders navigation with brand name', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    expect(screen.getByText('Marwan')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('numbers the items as acts I–IV', () => {
    const { container } = renderWithTheme(<Navigation {...mockProps} />)
    const numerals = Array.from(container.querySelectorAll('.fa-nav__idx')).map(
      (el) => el.textContent
    )
    expect(numerals).toEqual(['I', 'II', 'III', 'IV'])
  })

  it('applies the scrolled style when scrolled prop is true', () => {
    const { container } = renderWithTheme(
      <Navigation {...mockProps} scrolled={true} />
    )
    expect(
      container.querySelector('.fa-nav.fa-nav--scrolled')
    ).toBeInTheDocument()
  })

  it('calls onNavigate with the scene id', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(mockProps.onNavigate).toHaveBeenCalledWith('about')
  })

  it('links acts to their addresses', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: /Marwan/ })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('toggles the mobile menu when the menu button is clicked', () => {
    const { container } = renderWithTheme(<Navigation {...mockProps} />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(toggle)
    expect(container.querySelector('.fa-nav--open')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('marks the current scene', () => {
    renderWithTheme(<Navigation {...mockProps} active="about" />)
    const active = screen.getByRole('link', { name: 'About' })
    expect(active).toHaveClass('is-active')
    expect(active).toHaveAttribute('aria-current', 'location')
  })

  it('has a labelled navigation landmark, a sound toggle and a theme toggle', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Turn sound on' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Switch to (light|dark) mode/ })
    ).toBeInTheDocument()
  })

  it('hides the toggles and dims during the intro', () => {
    const { container } = renderWithTheme(<Navigation {...mockProps} intro />)
    expect(
      screen.queryByRole('button', { name: /Switch to/ })
    ).not.toBeInTheDocument()
    expect(container.querySelector('.site-header--intro')).toBeInTheDocument()
  })
})
