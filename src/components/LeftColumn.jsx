import { motion } from 'framer-motion'
import CounterUnit from './CounterUnit.jsx'
import MagneticButton from './MagneticButton.jsx'
import SineWaveLayer from './SineWaveLayer.jsx'

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
    <header className="relative flex flex-col justify-between px-6 py-10 md:px-12 md:py-16 overflow-hidden bg-bg">
      <SineWaveLayer />

      <motion.div
        className="relative z-20 flex flex-col gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={irisComplete ? 'visible' : 'hidden'}
      >
        {/* Logo — w-14 = 56px mobile, 72px desktop; explicit attrs prevent CLS */}
        <motion.div variants={logoVariants} className="flex items-center gap-4">
          <img
            src="/kvhlogotransparent.png"
            alt="KvH - Kyle van Heerden personal brand monogram"
            width="72"
            height="72"
            className="w-14 h-14 md:w-[72px] md:h-[72px]"
            style={{ filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.25))' }}
          />
        </motion.div>

        {/* Profile photo — w-28 = 112px mobile, 148px desktop; explicit attrs prevent CLS */}
        <motion.div variants={logoVariants} className="relative w-28 h-28 md:w-[148px] md:h-[148px]">
          <div className="absolute inset-[-8px] rounded-full border border-gold/15 pointer-events-none" />
          <div className="absolute inset-[-3px] rounded-full border border-gold/25 pointer-events-none" />
          <img
            src="/photos/kyle2.jpg"
            srcSet="/photos/kyle2.jpg 1x, /photos/kyle2.jpg 2x"
            alt="Kyle van Heerden, Pharmaceutical Marketing Strategist"
            width="148"
            height="148"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full rounded-full object-cover object-center"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-bg/40 via-transparent to-transparent pointer-events-none" />
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
