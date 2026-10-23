/**
 * useActKeys tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { useActKeys } from '@/theatre/useActKeys'
import type { SceneId } from '@/theatre/scenes'

const Host = ({
  current,
  onNavigate,
}: {
  current: SceneId
  onNavigate: (id: SceneId) => void
}) => {
  useActKeys(current, onNavigate)
  return <input aria-label="field" />
}

describe('useActKeys', () => {
  it('moves with the arrow keys', () => {
    const onNavigate = vi.fn()
    render(<Host current="about" onNavigate={onNavigate} />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNavigate).toHaveBeenCalledWith('skills')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(onNavigate).toHaveBeenCalledWith('prologue')
  })

  it('stops at either end', () => {
    const onNavigate = vi.fn()
    const { rerender } = render(
      <Host current="prologue" onNavigate={onNavigate} />
    )
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    rerender(<Host current="contact" onNavigate={onNavigate} />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('ignores typing and modifier keys', () => {
    const onNavigate = vi.fn()
    const { getByLabelText } = render(
      <Host current="about" onNavigate={onNavigate} />
    )
    fireEvent.keyDown(getByLabelText('field'), { key: 'ArrowRight' })
    for (const mod of ['ctrlKey', 'altKey', 'metaKey', 'shiftKey']) {
      fireEvent.keyDown(window, { key: 'ArrowRight', [mod]: true })
    }
    expect(onNavigate).not.toHaveBeenCalled()
  })
})
