/**
 * NextAct tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NextAct from '@/theatre/NextAct'

describe('NextAct', () => {
  it('offers the next act', () => {
    const onNavigate = vi.fn()
    render(<NextAct current="about" onNavigate={onNavigate} />)
    const link = screen.getByRole('link', { name: /Next act/ })
    expect(link).toHaveAttribute('href', '/skills')
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalledWith('skills')
  })

  it('returns to the beginning after the last act', () => {
    const onNavigate = vi.fn()
    render(<NextAct current="contact" onNavigate={onNavigate} />)
    const link = screen.getByRole('link', { name: 'Back to the beginning' })
    expect(link).toHaveAttribute('href', '/')
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalledWith('prologue')
  })
})
