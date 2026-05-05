import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

export default function CounterUnit({ value, suffix, label, irisComplete }) {
  const reducedMotion = useReducedMotion()
  const count = useMotionValue(reducedMotion ? value : 0)
  const rounded = useTransform(count, v => Math.round(v))

  useEffect(() => {
    if (!irisComplete || reducedMotion) return
    const controls = animate(count, value, {
      duration: 1.4,
      delay: 0.6,
      ease: [0.25, 1, 0.5, 1]
    })
    return controls.stop
  }, [irisComplete, value, count, reducedMotion])

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-baseline gap-0.5">
        <motion.span
          className="font-serif font-semibold text-gold"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1 }}
        >
          {rounded}
        </motion.span>
        <span
          className="font-serif font-semibold text-gold"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 2.4rem)' }}
        >
          {suffix}
        </span>
      </div>
      <span
        className="font-sans font-light text-text-muted uppercase tracking-[0.1em] mt-1 leading-tight block w-full"
        style={{ fontSize: '0.7rem' }}
      >
        {label}
      </span>
    </div>
  )
}
