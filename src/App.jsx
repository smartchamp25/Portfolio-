import { useState, useEffect } from 'react'
import { Code2, Rocket, Heart, Mail, ExternalLink, ChevronDown, Sparkles, Zap, Layers } from 'lucide-react'
import './App.css'
import cabinImage from './Data/cabin-001.jpg'

// Icon components using emoji for now (we can update to SVG later)
const GithubIcon = () => <span style={{ fontSize: '24px' }}>🐙</span>
const LinkedinIcon = () => <span style={{ fontSize: '24px' }}>💼</span>
const TwitterIcon = () => <span style={{ fontSize: '24px' }}>🐦</span>

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const skills = [
    { name: 'React', level: 90, icon: '⚛️', color: '#61DAFB' },
    { name: 'JavaScript', level: 85, icon: '📜', color: '#F7DF1E' },
    { name: 'HTML/CSS', level: 80, icon: '🎨', color: '#E34F26' },
    { name: 'Tailwind CSS', level: 75, icon: '💨', color: '#06B6D4' },
    { name: 'Git', level: 70, icon: '🌿', color: '#F05032' },
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
    <div className="portfolio">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <span className="brand-text">M</span>
        </div>
        <div className="nav-links">
          {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Available for opportunities</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">Hi, I'm</span>
            <span className="name-title">Marwan</span>
            <span className="title-line role">Frontend Developer</span>
          </h1>

          <p className="hero-subtitle">
            Passionate about creating beautiful, responsive, and user-friendly web experiences.
            Turning ideas into elegant digital reality.
          </p>

          <div className="hero-actions">
            <button onClick={() => scrollToSection('projects')} className="btn-primary">
              <Rocket size={20} />
              View My Work
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn-secondary">
              <Mail size={20} />
              Get In Touch
            </button>
          </div>

          <div className="hero-social">
            <a href="https://github.com/smartchamp25" target="_blank" rel="noopener noreferrer" className="social-icon">
              <GithubIcon />
            </a>
            <a href="https://www.linkedin.com/in/marwan-smartchamp-1748b8383/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <LinkedinIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <TwitterIcon />
            </a>
          </div>
        </div>

        <button onClick={() => scrollToSection('about')} className="scroll-indicator">
          <ChevronDown size={32} />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2 className="section-title">
            <Heart size={32} />
            About Me
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              Hello! I'm <strong>Marwan</strong>, an aspiring Frontend Developer with a passion for
              creating engaging and intuitive user experiences. I believe that great design combined
              with clean code can make a real difference in how people interact with technology.
            </p>
            <p>
              I'm currently expanding my knowledge in modern web technologies, focusing on React and
              creating responsive, accessible applications. I'm excited to bring fresh ideas and
              enthusiasm to a team where I can contribute and grow.
            </p>
            <p>
              When I'm not coding, you can find me exploring new design trends, contributing to
              open-source projects, or learning about the latest frontend innovations.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <Code2 size={40} />
              <h3>1+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-card">
              <Zap size={40} />
              <h3>100%</h3>
              <p>Dedication</p>
            </div>
            <div className="stat-card">
              <Layers size={40} />
              <h3>∞</h3>
              <p>Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="section-header">
          <h2 className="section-title">
            <Zap size={32} />
            My Skills
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card">
              <div className="skill-icon" style={{ backgroundColor: `${skill.color}20` }}>
                <span className="skill-emoji">{skill.icon}</span>
              </div>
              <h3>{skill.name}</h3>
              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                ></div>
              </div>
              <span className="skill-level">{skill.level}%</span>
            </div>
          ))}
        </div>

        <div className="learning-badge">
          <Sparkles size={20} />
          <span>Currently expanding my skills in React, modern CSS, and web accessibility!</span>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="section-header">
          <h2 className="section-title">
            <Rocket size={32} />
            My Projects
          </h2>
          <div className="title-line"></div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.title} className={`project-card ${project.featured ? 'featured' : ''}`}>
              {project.featured && <div className="featured-badge">Featured</div>}
              <div className="project-image">
                {project.isRealImage ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <span className="project-emoji">{project.image}</span>
                )}
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <span style={{ fontSize: '18px' }}>🐙</span>
                    Code
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <div className="contact-text">
            <h2 className="section-title">
              <Mail size={32} />
              Let's Connect
            </h2>
            <p>
              I'm always excited to connect with fellow developers, potential employers,
              and anyone who shares a passion for creating great web experiences.
            </p>
            <p>
              Whether you have a question, want to collaborate, or just want to say hello,
              feel free to reach out!
            </p>
          </div>

          <div className="contact-card">
            <a href="mailto:smartchampmarwan@gmail.com" className="contact-item">
              <Mail size={24} />
              <span>Personal Gmail</span>
            </a>
            <a href="https://github.com/smartchamp25" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span style={{ fontSize: '24px' }}>🐙</span>
              <span>Github</span>
            </a>
            <a href="https://www.linkedin.com/in/marwan-smartchamp-1748b8383/" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span style={{ fontSize: '24px' }}>💼</span>
              <span>LinkedIn</span>
            </a>
          </div>

          <a href="mailto:smartchampmarwan@gmail.com" className="btn-primary large">
            <Mail size={24} />
            Send Me a Message
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Designed & Built with <Heart size={16} fill="currentColor" /> by Marwan</p>
        <p className="footer-tech">Powered by React • Vite • Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default App
