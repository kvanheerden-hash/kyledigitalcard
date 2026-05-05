import { motion } from 'framer-motion'
import CounterUnit from './CounterUnit.jsx'
import MagneticButton from './MagneticButton.jsx'
import SineWaveLayer from './SineWaveLayer.jsx'
import LogoOrbit from './LogoOrbit.jsx'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.0
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const logoVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
}

const countersData = [
  { value: 10, suffix: '+', label: 'Years Professional' },
  { value: 5,  suffix: '+', label: 'Years Clinical' },
  { value: 7,  suffix: '+', label: 'Years Marketing' },
]

export default function LeftColumn({ irisComplete }) {
  return (
    <header className="relative flex flex-col justify-between px-6 py-8 md:px-12 md:pt-10 md:pb-16 overflow-hidden bg-bg">
      <SineWaveLayer className="hidden md:block absolute bottom-0 left-0 w-full h-[260px] pointer-events-none z-10" />

      <motion.div
        className="relative z-20 flex flex-col gap-5 md:gap-7"
        variants={containerVariants}
        initial="hidden"
        animate={irisComplete ? 'visible' : 'hidden'}
      >
        {/* Profile photo + logo side by side */}
        <motion.div variants={logoVariants} className="flex items-center gap-5 md:gap-6">
          {/* Profile photo */}
          <div className="relative w-24 h-24 md:w-[132px] md:h-[132px] shrink-0">
            <div className="absolute inset-[-6px] rounded-full border border-gold/15 pointer-events-none" />
            <div className="absolute inset-[-2px] rounded-full border border-gold/25 pointer-events-none" />
            <img
              src="/photos/kyle2.jpg"
              srcSet="/photos/kyle2.jpg 1x, /photos/kyle2.jpg 2x"
              alt="Kyle van Heerden, Pharmaceutical Marketing Strategist"
              width="132"
              height="132"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full rounded-full object-cover object-center"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-bg/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Animated logo — travel orbit handled by LogoOrbit */}
          <LogoOrbit irisComplete={irisComplete} />
        </motion.div>

        {/* Identity */}
        <div className="flex flex-col gap-2">
          <motion.div variants={itemVariants}>
            <h1
              className="font-serif font-light text-text-primary leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.8rem)' }}
            >
              Kyle van Heerden
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* Minimum raised from 0.7rem to 0.8rem to ensure readability on 320px screens */}
            <p
              className="font-sans font-medium text-gold uppercase tracking-[0.18em]"
              style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}
            >
              Marketing Leadership in Modern Healthcare
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* Minimum raised from 0.7rem to 0.8rem */}
            <p
              className="font-sans font-light text-text-muted italic"
              style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}
            >
              Insight-Led. Impact-Focused. Growth-Driven.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="w-12 h-px bg-gold/40 my-3 md:my-4" />
          </motion.div>
        </div>

        {/* Grid layout gives each counter equal width so numbers and labels stay aligned */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-x-4 md:gap-x-6">
          {countersData.map((c) => (
            <CounterUnit
              key={c.label}
              value={c.value}
              suffix={c.suffix}
              label={c.label}
              irisComplete={irisComplete}
            />
          ))}
        </motion.div>

        {/* Desktop: inline magnetic button. Mobile: MagneticButton renders its own fixed pill */}
        <motion.div variants={itemVariants}>
          <MagneticButton />
        </motion.div>
      </motion.div>
    </header>
  )
}
