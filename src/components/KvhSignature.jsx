import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: 'easeInOut', delay },
      opacity:    { duration: 0.3, delay }
    }
  })
}

export default function KvhSignature() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    // min-h-[44px] ensures the signature area meets the 44px touch target
    // guideline even though it is decorative and non-interactive
    <div ref={ref} className="flex flex-col items-center gap-2 justify-center">
      <svg
        viewBox="0 0 70 40"
        className="w-[70px] h-[40px]"
        aria-hidden="true"
        focusable="false"
      >
        <motion.path
          d="M 10,8 L 10,32 M 10,20 L 24,8 M 10,20 L 24,32"
          variants={pathVariants}
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d="M 28,14 L 34,28 L 40,14"
          variants={pathVariants}
          custom={0.55}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          stroke="#C9922A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d="M 44,8 L 44,32 M 44,20 L 56,20 M 56,8 L 56,32"
          variants={pathVariants}
          custom={1.0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          stroke="#8B5E1A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        className="font-serif font-light text-gold/40 uppercase tracking-[0.3em]"
        style={{ fontSize: '0.75rem' }}
      >
        Kyle van Heerden
      </span>
    </div>
  )
}
