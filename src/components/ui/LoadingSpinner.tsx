import { Loader } from '../fourth-act'
import './LoadingSpinner.css'

/**
 * LoadingSpinner — fallback for lazy-loaded sections.
 * Four stars light up in turn (the Fourth Act Loader).
 */
export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <Loader label="The curtain rises" />
    </div>
  )
}
