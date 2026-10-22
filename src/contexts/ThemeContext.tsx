import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react'

// ==========================================
// TYPES
// ==========================================

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
}

// ==========================================
// CONTEXT
// ==========================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ==========================================
// HOOK
// ==========================================

// The hook lives beside its provider on purpose; editing this file reloads the page instead of hot-swapping
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get initial theme from localStorage or default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    return savedTheme || 'dark'
  })

  const isTransitioning = useRef(false)

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    const html = document.documentElement

    // Add transitioning class for smooth animation
    html.classList.add('theme-transitioning')
    isTransitioning.current = true

    // Set the new theme
    html.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    // Remove transitioning class after animation completes
    const timeout = setTimeout(() => {
      html.classList.remove('theme-transitioning')
      isTransitioning.current = false
    }, 400)

    return () => clearTimeout(timeout)
  }, [theme])

  const toggleTheme = () => {
    if (!isTransitioning.current) {
      setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
