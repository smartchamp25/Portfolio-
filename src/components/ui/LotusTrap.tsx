import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks'
import outer from '../../assets/lotus/outer.webp'
import inner from '../../assets/lotus/inner.webp'
import sphere from '../../assets/lotus/sphere.webp'
import './LotusTrap.css'

interface LotusTrapProps {
  className?: string
}

// ==========================================
// LOTUS TRAP — arms once when it comes into view, again on hover:
// the inner petals turn one petal clockwise, the outer ones counter-clockwise
// ==========================================

const LotusTrap = ({ className }: LotusTrapProps) => {
  const reduced = usePrefersReducedMotion()
  const [arming, setArming] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLImageElement>(null)

  // Ready to arm again once the inner petals finish their turn
  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const settle = () => setArming(false)
    el.addEventListener('animationend', settle)
    return () => el.removeEventListener('animationend', settle)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArming(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  const layer = (
    src: string,
    name: string,
    imgRef?: React.Ref<HTMLImageElement>
  ) => (
    <img
      ref={imgRef}
      className={`lotus-trap__layer lotus-trap__${name}`}
      src={src}
      alt=""
      width={96}
      height={96}
      decoding="async"
    />
  )

  return (
    <span
      ref={ref}
      className={['lotus-trap', arming && 'is-arming', className]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => {
        if (!reduced) setArming(true)
      }}
    >
      {layer(outer, 'outer')}
      {layer(inner, 'inner', innerRef)}
      {layer(sphere, 'sphere')}
    </span>
  )
}

export default LotusTrap
