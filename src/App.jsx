import { useState, useEffect } from 'react'
import { Code2, Rocket, Heart, Mail, ExternalLink, ChevronDown, Sparkles, Zap, Layers, Menu, X } from 'lucide-react'
import './App.css'
import cabinImage from './Data/cabin-001.jpg'

// Social media SVG icons
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = ['hero', 'about', 'skills', 'projects', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Generate particles once on mount
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 5 + Math.random() * 10
    }))
  )

  const skills = [
    { name: 'React', level: 90, icon: '⚛️', color: '#61DAFB' },
    { name: 'JavaScript', level: 85, icon: '📜', color: '#F7DF1E' },
    { name: 'HTML/CSS', level: 80, icon: '🎨', color: '#E34F26' },
    { name: 'Tailwind CSS', level: 75, icon: '💨', color: '#06B6D4' },
    { name: 'Supabase', level: 70, icon: '🗄️', color: '#3ECF8E' },
    { name: 'Git', level: 65, icon: '🌿', color: '#F05032' },
  ]

  const projects = [
    {
      title: 'The wild Oasis',
      description: 'The Wild Oasis is a luxury cabin resort management system built with React, Vite, and Supabase. It streamlines hotel operations by managing cabin inventory, guest bookings, check-ins/check-outs, and business analytics—all through a modern admin dashboard. Key features include interactive charts for sales/occupancy tracking, customizable settings, and secure authentication. The tech stack combines React Query for data fetching, Styled Components for styling, and Recharts for visualizations—delivering a polished, feature-complete solution for hospitality management.',
      tags: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind', 'Supabase'],
      image: cabinImage,
      isRealImage: true,
      link: '#',
      github: 'https://github.com/smartchamp25',
      featured: true
    },
    {
      title: 'Coming Soon...',
      description: 'Your next great project will be showcased here. Keep building and add your best work!',
      tags: ['In Progress'],
      image: '🔨',
      link: '#',
      github: '#',
      featured: false
    },
    {
      title: 'Coming Soon...',
      description: 'Another opportunity to showcase your creativity and technical skills.',
      tags: ['Planning'],
      image: '💡',
      link: '#',
      github: '#',
      featured: false
    }
  ]

  return (
    <div className="portfolio-unique">
      {/* Custom Cursor Follower */}
      <div className="cursor-follower" style={{
        left: mousePosition.x + 'px',
        top: mousePosition.y + 'px'
      }} />

      {/* Floating Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div key={particle.id} className="particle" style={{
            left: particle.left + '%',
            animationDelay: particle.animationDelay + 's',
            animationDuration: particle.animationDuration + 's'
          }} />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`nav-unique ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand-unique">
          <span className="brand-letter">M</span>
          <span className="brand-dot"></span>
        </div>

        <div className={`nav-menu-unique ${mobileMenuOpen ? 'open' : ''}`}>
          {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className={`nav-item-unique ${activeSection === item.toLowerCase() ? 'active' : ''}`}
            >
              <span className="nav-number">0{['About', 'Skills', 'Projects', 'Contact'].indexOf(item) + 1}</span>
              {item}
            </button>
          ))}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-unique">
        <div className="hero-bg-unique">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>

        <div className="hero-content-unique">
          <div className="hero-badge-unique">
            <Sparkles size={14} />
            <span>Available for opportunities</span>
          </div>

          <div className="hero-title-unique">
            <h1 className="title-main">
              <span className="title-line">Hi, I'm</span>
              <span className="name-glow">Marwan</span>
            </h1>
            <div className="role-wrapper">
              <span className="role-text">Frontend Developer</span>
              <div className="role-underline"></div>
            </div>
          </div>

          <p className="hero-desc-unique">
            I craft <span className="highlight">beautiful</span>, <span className="highlight">responsive</span>, and
            <span className="highlight">user-friendly</span> web experiences that leave lasting impressions.
          </p>

          <div className="hero-actions-unique">
            <button onClick={() => scrollToSection('projects')} className="btn-primary-unique">
              <Rocket size={18} />
              View Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn-secondary-unique">
              <Mail size={18} />
              Contact Me
            </button>
          </div>

          <div className="hero-social-unique">
            <a href="https://github.com/smartchamp25" target="_blank" rel="noopener noreferrer" className="social-link-unique">
              <GithubIcon />
            </a>
            <a href="https://www.linkedin.com/in/marwan-smartchamp-1748b8383/" target="_blank" rel="noopener noreferrer" className="social-link-unique">
              <LinkedinIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link-unique">
              <TwitterIcon />
            </a>
          </div>
        </div>

        <button onClick={() => scrollToSection('about')} className="scroll-hint-unique">
          <span className="scroll-text">Scroll</span>
          <ChevronDown size={20} className="scroll-icon" />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="about-unique">
        <div className="section-header-unique">
          <span className="section-number">01.</span>
          <h2 className="section-title-unique">About Me</h2>
          <div className="section-line"></div>
        </div>

        <div className="about-grid-unique">
          <div className="about-text-unique">
            <p>
              Hello! I'm <strong className="name-highlight">Marwan</strong>, an aspiring
              <span className="role-highlight"> Frontend Developer</span> with a passion for
              creating engaging and intuitive user experiences.
            </p>
            <p>
              I believe that great design combined with clean code can make a real difference
              in how people interact with technology. Currently expanding my knowledge in
              modern web technologies, focusing on React and creating responsive, accessible applications.
            </p>
            <p>
              I'm excited to bring fresh ideas and enthusiasm to a team where I can
              contribute and grow. When I'm not coding, you can find me exploring new design
              trends and learning about the latest frontend innovations.
            </p>
          </div>

          <div className="stats-grid-unique">
            <div className="stat-card-unique">
              <div className="stat-icon-wrapper">
                <Code2 size={28} />
              </div>
              <h3 className="stat-number">1+</h3>
              <p className="stat-label">Projects</p>
            </div>
            <div className="stat-card-unique">
              <div className="stat-icon-wrapper">
                <Zap size={28} />
              </div>
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">Dedication</p>
            </div>
            <div className="stat-card-unique">
              <div className="stat-icon-wrapper">
                <Layers size={28} />
              </div>
              <h3 className="stat-number">∞</h3>
              <p className="stat-label">Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-unique">
        <div className="section-header-unique">
          <span className="section-number">02.</span>
          <h2 className="section-title-unique">My Skills</h2>
          <div className="section-line"></div>
        </div>

        <div className="skills-container-unique">
          {skills.map((skill, index) => (
            <div key={skill.name} className="skill-card-unique" style={{ '--delay': index * 100 }}>
              <div className="skill-front" style={{ '--skill-color': skill.color }}>
                <span className="skill-icon">{skill.icon}</span>
                <h3>{skill.name}</h3>
                <div className="skill-level-text">{skill.level}%</div>
              </div>
              <div className="skill-back" style={{ background: `${skill.color}15` }}>
                <div className="skill-progress-wrapper">
                  <div className="skill-bar-unique" style={{ width: `${skill.level}%`, backgroundColor: skill.color }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="learning-banner-unique">
          <Sparkles size={16} />
          <span>Continuously learning and expanding my skillset</span>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-unique">
        <div className="section-header-unique">
          <span className="section-number">03.</span>
          <h2 className="section-title-unique">Featured Projects</h2>
          <div className="section-line"></div>
        </div>

        <div className="projects-container-unique">
          {projects.map((project) => (
            <div key={project.title} className={`project-card-unique ${project.featured ? 'featured' : ''}`}>
              {project.featured && <div className="featured-tag-unique">⭐ Featured Project</div>}

              <div className="project-visual">
                {project.isRealImage ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <span className="project-emoji">{project.image}</span>
                )}
              </div>

              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-btn">
                    <GithubIcon />
                    Code
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                    <ExternalLink size={16} />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-unique">
        <div className="section-header-unique">
          <span className="section-number">04.</span>
          <h2 className="section-title-unique">Let's Connect</h2>
          <div className="section-line"></div>
        </div>

        <div className="contact-content-unique">
          <p className="contact-text">
            I'm always excited to connect with fellow developers, potential employers,
            and anyone who shares a passion for creating great web experiences.
          </p>

          <div className="contact-links-unique">
            <a href="mailto:smartchampmarwan@gmail.com" className="contact-link-unique">
              <Mail size={22} />
              <span>smartchampmarwan@gmail.com</span>
            </a>
            <a href="https://github.com/smartchamp25" target="_blank" rel="noopener noreferrer" className="contact-link-unique">
              <GithubIcon />
              <span>github.com/smartchamp25</span>
            </a>
            <a href="https://www.linkedin.com/in/marwan-smartchamp-1748b8383/" target="_blank" rel="noopener noreferrer" className="contact-link-unique">
              <LinkedinIcon />
              <span>linkedin.com/in/marwan-smartchamp-1748b8383</span>
            </a>
          </div>

          <a href="mailto:smartchampmarwan@gmail.com" className="cta-button-unique">
            <Mail size={20} />
            Send Me a Message
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-unique">
        <p>Designed & Built with <Heart size={14} fill="currentColor" /> by Marwan</p>
        <p className="footer-tech-unique">React • Vite • Modern CSS</p>
      </footer>
    </div>
  )
}

export default App
