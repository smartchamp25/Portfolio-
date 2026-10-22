import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './components/fourth-act/fourth-act.css'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * Application entry point
 * Wrapped in ErrorBoundary to catch and handle component errors gracefully
 * Wrapped in ThemeProvider to enable theme switching functionality
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
