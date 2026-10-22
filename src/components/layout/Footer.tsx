import { memo } from 'react'
import { Mail } from 'lucide-react'
import { Footer as FaFooter, Icon, IconButton } from '../fourth-act'
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../../constants'
import './Footer.css'

// ==========================================
// FOOTER — the curtain
// ==========================================

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <FaFooter
      className="site-footer"
      name="Marwan"
      note="Designed and built with care — every pixel placed on purpose."
      fine={`© ${year} Marwan · React · Vite · TypeScript`}
    >
      <IconButton
        size="sm"
        label="Visit GitHub profile"
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="github" size={16} />
      </IconButton>
      <IconButton
        size="sm"
        label="Visit LinkedIn profile"
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="linkedin" size={16} />
      </IconButton>
      <IconButton size="sm" label="Send an email" href={`mailto:${EMAIL}`}>
        <Mail size={16} strokeWidth={1.5} />
      </IconButton>
    </FaFooter>
  )
}

export default memo(Footer)
