import { Mail } from 'lucide-react'
import { ActHeading, Button, ContactLink, Icon } from '../fourth-act'
import { GITHUB_URL, EMAIL, LINKEDIN_URL } from '../../constants'
import './ContactSection.css'

// ==========================================
// ACT IV — THE ENCORE
// ==========================================

const ContactSection = () => {
  const githubUsername = GITHUB_URL.replace('https://github.com/', '')
  const linkedinUsername = LINKEDIN_URL.replace(
    'https://www.linkedin.com/in/',
    ''
  ).replace(/\/$/, '')

  return (
    <section
      id="contact"
      className="act encore fa-stage"
      aria-labelledby="contact-title"
    >
      <div className="encore__glow" aria-hidden="true" />
      <div className="act__inner encore__inner">
        <ActHeading
          act="IV"
          eyebrow="The Encore"
          align="center"
          id="contact-title"
          title={
            <>
              Let's stage the <em>next</em> one
            </>
          }
          lead="Every performance deserves an encore. Let's connect and create something exceptional together."
        />

        <div className="encore__links reveal-on-scroll">
          <ContactLink
            icon={<Mail size={20} strokeWidth={1.5} />}
            label="Email"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
          />
          <ContactLink
            icon={<Icon name="github" />}
            label="GitHub"
            value={`github.com/${githubUsername}`}
            href={GITHUB_URL}
            external
          />
          <ContactLink
            icon={<Icon name="linkedin" />}
            label="LinkedIn"
            value={`linkedin.com/in/${linkedinUsername}`}
            href={LINKEDIN_URL}
            external
          />
        </div>

        <div className="encore__cta reveal-on-scroll">
          <Button
            variant="primary"
            size="lg"
            href={`mailto:${EMAIL}`}
            icon={<Mail size={20} strokeWidth={1.5} />}
          >
            Email me
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
