/**
 * Navigation Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '@/components/layout/Navigation'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Wrapper to provide theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Navigation Component', () => {
  const mockProps = {
    scrolled: false,
    activeSection: 'prologue',
    scrollToSection: vi.fn(),
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

  it('calls scrollToSection when nav item is clicked', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(mockProps.scrollToSection).toHaveBeenCalledWith('about')
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

  it('marks the current section', () => {
    renderWithTheme(<Navigation {...mockProps} activeSection="about" />)
    const active = screen.getByRole('link', { name: 'About' })
    expect(active).toHaveClass('is-active')
    expect(active).toHaveAttribute('aria-current', 'location')
  })

  it('has a labelled navigation landmark and a theme toggle', () => {
    renderWithTheme(<Navigation {...mockProps} />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Switch to (light|dark) mode/ })
    ).toBeInTheDocument()
  })
})
