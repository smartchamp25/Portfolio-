/**
 * Footer tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

describe('Footer', () => {
  it("carries Riot's fan-content disclaimer for Jhin's voice", () => {
    render(<Footer />)
    expect(
      screen.getByText(
        /This portfolio was created under Riot Games’ “Legal Jibber Jabber” policy using assets owned by Riot Games\. Riot Games does not endorse or sponsor this project\./
      )
    ).toBeInTheDocument()
  })
})
