import { motion, useSpring, useTransform } from 'framer-motion'

export const pillarVariants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function PillarCard({ number, icon, iconColor, title, copy, tag }) {
  const cardY = useSpring(0, { stiffness: 300, damping: 20 })
  const cardGlow = useSpring(0, { stiffness: 200, damping: 18 })

  const boxShadow = useTransform(
    cardGlow,
    [0, 1],
    ['0 0 0px rgba(201,168,76,0)', '0 0 40px rgba(201,168,76,0.12), 0 0 80px rgba(201,168,76,0.05)']
  )

  const borderColor = useTransform(
    cardGlow,
    [0, 1],
    ['rgba(201,168,76,0.12)', 'rgba(201,168,76,0.50)']
  )

  return (
    <motion.article
      variants={pillarVariants}
      style={{ y: cardY, boxShadow, borderColor, willChange: 'transform', background: 'rgba(255,255,255,0.03)' }}
      onHoverStart={() => { cardY.set(-3); cardGlow.set(1) }}
      onHoverEnd={() => { cardY.set(0); cardGlow.set(0) }}
      // whileTap provides tactile feedback on touch devices in place of hover
      whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
      className="border rounded-lg p-4 backdrop-blur-sm cursor-default"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <motion.span
              className="font-serif font-light text-gold/30"
              style={{ fontSize: '1.6rem' }}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {number}
            </motion.span>
            <svg
              viewBox="0 0 36 28"
              className="w-9 h-7 shrink-0"
              fill="none"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d={icon} />
            </svg>
          </div>
          <h2 className="font-serif font-semibold text-text-primary" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
            {title}
          </h2>
          {/* Minimum raised from 0.78rem (12.5px) to 0.875rem (14px) for mobile readability */}
          <p className="font-sans font-light text-text-muted leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 0.95rem)' }}>
            {copy}
          </p>
          {/* Tag raised from 0.6rem (9.6px) to 0.7rem (11.2px) */}
          <span
            className="font-sans font-light text-gold/50 uppercase tracking-[0.1em]"
            style={{ fontSize: '0.7rem' }}
          >
            {tag}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
