import { Component, ErrorInfo, ReactNode } from 'react'

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// ==========================================
// ERROR BOUNDARY COMPONENT
// ==========================================

/**
 * Error Boundary that catches JavaScript errors anywhere in the component tree
 * Logs errors and displays a fallback UI instead of crashing the entire app
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Update state when error occurs
   * This enables displaying the fallback UI
   */
  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  /**
   * Log error details for debugging
   * Called when any child component throws an error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  /**
   * Reset error boundary state
   * Useful for retry mechanisms
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided via props
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="error-boundary-fallback">
          <div className="error-boundary-content">
            <h2>⚠️ Something went wrong</h2>
            <p>
              An unexpected error stopped the page from loading. Please refresh
              the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
            <button
              onClick={this.resetErrorBoundary}
              className="error-retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
