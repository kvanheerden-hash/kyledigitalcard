import { motion } from 'framer-motion'
import PillarCard from './PillarCard.jsx'
import SineWaveLayer from './SineWaveLayer.jsx'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const pillarsData = [
  {
    number: '01',
    title: 'Clinical Foundation',
    icon: 'M 0,12 L 8,12 L 12,4 L 16,20 L 20,12 L 28,12',
    copy: `A clinician before a marketer. Five years in orthopaedic practice shapes how science gets translated, how clinicians get spoken to, and how positioning gets built.`,
    tag: '5 Years · Orthopaedic Practice',
    iconColor: '#C9A84C'
  },
  {
    number: '02',
    title: 'Strategic Execution',
    icon: 'M 0,18 L 8,14 L 16,8 L 24,4',
    copy: `Seven years building marketing campaigns across healthcare. Now marketing leadership for a pharmaceutical manufacturer. Department-wide ownership of campaigns, creative direction, and FDA-compliant promotional materials across Rx and OTC products.`,
    tag: '7 Years Marketing · FDA, OPDP, FTC Compliance',
    iconColor: '#C9922A'
  },
  {
    number: '03',
    title: 'Digital Architecture',
    icon: 'M 4,16 C 4,16 12,4 20,16 C 20,16 28,28 36,16',
    copy: `A modern digital marketing infrastructure built for healthcare. Full-department oversight of digital assets engineered for regulatory scrutiny, brand consistency, and measurable engagement at scale.`,
    tag: 'Pharmaceutical Marketing · Script Lift · Pull-Through',
    iconColor: '#8B5E1A'
  }
]

export default function RightColumn({ irisComplete }) {
  return (
    <section
      aria-label="Experience"
      className="relative h-full overflow-y-auto"
    >
      {/* Atmospheric background photo — desktop only; lazy-loaded since it is off-screen on mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <img
          src="/photos/kyle2.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="800"
          height="1000"
          className="w-full h-full object-cover object-center opacity-[0.12] scale-105"
          style={{ filter: 'grayscale(30%) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/70 to-bg/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-transparent to-bg/80" />
      </div>

      {/* Vertical connector line — desktop only */}
      <div className="hidden md:block absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />

      {/* Wave layers — top (flipped) and bottom */}
      <SineWaveLayer
        className="hidden md:block absolute top-0 right-0 w-full h-[220px] pointer-events-none z-10"
        flipY flipX
      />
      <SineWaveLayer
        className="hidden md:block absolute bottom-0 left-0 w-full h-[220px] pointer-events-none z-10"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-center px-6 py-8 md:px-12 md:py-10 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate={irisComplete ? 'visible' : 'hidden'}
      >
        {pillarsData.map((pillar) => (
          <PillarCard key={pillar.number} {...pillar} />
        ))}
      </motion.div>
    </section>
  )
}
