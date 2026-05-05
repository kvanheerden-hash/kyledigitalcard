import { motion } from 'framer-motion'

const waveVariants = {
  animate: {
    x: [0, -120, 0],
    transition: { duration: 22, ease: 'easeInOut', repeat: Infinity }
  }
}

const paths = Array.from({ length: 14 }, (_, i) => {
  const y = 60 + i * 7
  const color = i < 4 ? '#E8C060' : i < 9 ? '#C9922A' : '#8B5E1A'
  const opacity = i < 4 ? 0.09 : i < 9 ? 0.075 : 0.06
  return {
    d: `M -100,${y} C 150,${y - 50} 350,${y + 50} 700,${y - 20} C 900,${y - 60} 1100,${y + 30} 1400,${y}`,
    color,
    opacity
  }
})

export default function SineWaveLayer({ className, flipY = false, flipX = false }) {
  const base = "hidden md:block absolute bottom-0 left-0 w-[60vw] h-[220px] pointer-events-none z-10"
  const flipStyle = {}
  if (flipY && flipX) flipStyle.transform = 'scaleY(-1) scaleX(-1)'
  else if (flipY) flipStyle.transform = 'scaleY(-1)'
  else if (flipX) flipStyle.transform = 'scaleX(-1)'

  return (
    <svg
      className={className ?? base}
      viewBox="0 0 800 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flipStyle}
    >
      <motion.g variants={waveVariants} animate="animate">
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            stroke={p.color}
            strokeWidth="0.6"
            fill="none"
            opacity={p.opacity}
          />
        ))}
      </motion.g>
    </svg>
  )
}
