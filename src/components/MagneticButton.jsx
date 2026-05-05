import { useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function MagneticButton() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    if (isTouchDevice) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - rect.left - rect.width / 2
    const dy = e.clientY - rect.top - rect.height / 2
    x.set(dx * 0.35)
    y.set(dy * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (isTouchDevice) {
    return (
      <nav aria-label="Contact" className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center md:hidden">
        <a
          href="https://www.linkedin.com/in/kyle-van-heerden/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Kyle van Heerden on LinkedIn"
          className="flex items-center justify-center gap-2 w-full max-w-[380px] py-4 px-8 rounded-full text-gold font-sans font-normal uppercase tracking-[0.12em] text-sm border border-gold/45 backdrop-blur-[12px]"
          style={{ background: 'rgba(10,11,15,0.7)' }}
        >
          <LinkedInIcon />
          Connect on LinkedIn
        </a>
      </nav>
    )
  }

  return (
    <nav aria-label="Contact" className="hidden md:block">
      <div
        ref={ref}
        className="p-[80px] -m-[80px] inline-block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.a
          href="https://www.linkedin.com/in/kyle-van-heerden/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Kyle van Heerden on LinkedIn"
          style={{ x: springX, y: springY, willChange: 'transform', fontSize: '0.85rem', background: 'rgba(201,168,76,0.1)', display: 'inline-flex' }}
          whileHover={{ scale: 1.04, background: 'rgba(201,168,76,0.18)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2 py-3 px-8 rounded-full font-sans font-normal text-gold uppercase tracking-[0.12em] border border-gold/40"
        >
          <LinkedInIcon />
          Connect on LinkedIn
        </motion.a>
      </div>
    </nav>
  )
}
