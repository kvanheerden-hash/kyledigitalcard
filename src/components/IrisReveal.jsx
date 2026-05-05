import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const isMobile = window.innerWidth < 768
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const irisVariants = (isMobile || prefersReduced)
  ? {
      initial: { opacity: 1 },
      animate: {
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 }
      },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    }
  : {
      initial: { clipPath: 'circle(100% at 19% 12%)' },
      animate: {
        clipPath: 'circle(0% at 19% 12%)',
        transition: {
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.1
        }
      },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    }

export default function IrisReveal({ children, onComplete }) {
  const [done, setDone] = useState(false)

  const handleComplete = () => {
    setDone(true)
    onComplete?.()
  }

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            key="iris"
            variants={irisVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={handleComplete}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{ backgroundColor: '#0A0B0F' }}
          >
            {/* Full-bleed backdrop; explicit width/height prevent CLS during reveal */}
            <img
              src="/photos/kyle3.png"
              alt=""
              aria-hidden="true"
              loading="eager"
              width="1200"
              height="1600"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
            />
            <div className="absolute inset-0 bg-bg/65" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/kvhlogotransparent.png"
                alt="KvH"
                width="80"
                height="80"
                className="w-20 h-20 opacity-90"
                style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  )
}
