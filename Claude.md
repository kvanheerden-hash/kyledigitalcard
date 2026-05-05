╔══════════════════════════════════════════════════════════════════╗  
║         KvH DIGITAL BUSINESS CARD — GOD-TIER BUILD PROMPT       ║  
║         React 18 · Vite · Tailwind CSS · Framer Motion          ║  
╚══════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════  
SECTION 1: PROJECT SCAFFOLD  
═══════════════════════════════════════════════

PRIME DIRECTIVE: This is a personal brand site for a pharmaceutical   
marketing executive, not a portfolio. Never generate placeholder   
copy, lorem ipsum, or TODO comments. Every word in the final output   
must be final, production copy. If content is unspecified, infer   
from the brand context — do not leave blanks.

Bootstrap with:  
  npm create vite@latest kvh-card \-- \--template react  
  cd kvh-card  
  npm install tailwindcss @tailwindcss/vite framer-motion  
  npm install @fontsource/cormorant-garamond @fontsource/dm-sans

Vite config (vite.config.js):  
  import { defineConfig } from 'vite'  
  import react from '@vitejs/plugin-react'  
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({  
    plugins: \[react(), tailwindcss()\],  
    build: {  
      rollupOptions: {  
        output: { manualChunks: { framerMotion: \['framer-motion'\] } }  
      }  
    }  
  })

Tailwind config (tailwind.config.js) — extend theme with brand tokens:  
  theme: {  
    extend: {  
      colors: {  
        bg:         '\#0A0B0F',  
        surface:    '\#12141A',  
        'gold-bright': '\#E8C060',  
        'gold-mid':    '\#C9922A',  
        'gold-deep':   '\#8B5E1A',  
        'gold':        '\#C9A84C',  
        'text-primary': '\#F0EDE8',  
        'text-muted':   '\#6B7280',  
      },  
      fontFamily: {  
        serif: \['"Cormorant Garamond"', 'serif'\],  
        sans:  \['"DM Sans"', 'sans-serif'\],  
      },  
      fontSize: {  
        'fluid-hero':  'clamp(2.2rem, 5vw, 4.8rem)',  
        'fluid-title': 'clamp(0.7rem, 1.5vw, 1rem)',  
        'fluid-body':  'clamp(0.8rem, 1vw, 0.9rem)',  
      },  
    }  
  }

Place kvhlogo.png in /public/kvhlogo.png

═══════════════════════════════════════════════  
SECTION 2: COMPONENT ARCHITECTURE  
═══════════════════════════════════════════════

src/  
├── main.jsx  
├── App.jsx               ← root, mounts IrisReveal \+ Layout  
├── index.css             ← @fontsource imports, CSS custom props, grain  
├── components/  
│   ├── IrisReveal.jsx    ← page-open animation (Framer AnimatePresence)  
│   ├── CursorTracker.jsx ← lerp cursor (useRef \+ rAF, no Framer)  
│   ├── ParticleCanvas.jsx← canvas 2D particle field (useRef, useEffect)  
│   ├── SineWaveLayer.jsx ← SVG wave background (motion.svg)  
│   ├── LeftColumn.jsx    ← logo, name, counters, CTA  
│   ├── RightColumn.jsx   ← pillar cards \+ signature  
│   ├── PillarCard.jsx    ← single reusable pillar with spring hover  
│   ├── CounterUnit.jsx   ← animated count-up (useMotionValue)  
│   ├── MagneticButton.jsx← magnetic CTA (useSpring \+ mouse offset)  
│   └── KvhSignature.jsx  ← SVG path draw animation (useInView \+ variants)  
└── hooks/  
    ├── useMousePosition.js ← shared mouse tracking (mousemove listener)  
    └── useReducedMotion.js ← respects prefers-reduced-motion

═══════════════════════════════════════════════  
SECTION 3: DESIGN TOKENS (index.css)  
═══════════════════════════════════════════════

:root {  
  \--gold:        \#C9A84C;  
  \--gold-bright: \#E8C060;  
  \--gold-mid:    \#C9922A;  
  \--gold-deep:   \#8B5E1A;  
  \--bg:          \#0A0B0F;  
  \--surface:     \#12141A;  
}

@import '@fontsource/cormorant-garamond/300.css';  
@import '@fontsource/cormorant-garamond/600.css';  
@import '@fontsource/dm-sans/300.css';  
@import '@fontsource/dm-sans/400.css';  
@import '@fontsource/dm-sans/500.css';

/\* Grain overlay — applied via ::after on body \*/  
body::after {  
  content: '';  
  position: fixed;  
  inset: 0;  
  z-index: 999;  
  pointer-events: none;  
  opacity: 0.035;  
  mix-blend-mode: overlay;  
  background-image: url("data:image/svg+xml,\<svg xmlns='http://www.w3.org/2000/svg'\>  
    \<filter id='g'\>  
      \<feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/\>  
    \</filter\>  
    \<rect width='100%' height='100%' filter='url(%23g)'/\>  
  \</svg\>");  
}

/\* Registered custom properties for Houdini animation \*/  
@property \--gold-glow {  
  syntax: '\<number\>';  
  inherits: false;  
  initial-value: 0;  
}

html { cursor: none; }  
@media (pointer: coarse) { html { cursor: auto; } }

═══════════════════════════════════════════════  
SECTION 4: FRAMER MOTION — IRIS REVEAL  
═══════════════════════════════════════════════

IrisReveal.jsx — wraps the entire app:

  Use AnimatePresence with initial={true}.  
  Render a full-screen overlay div on top of everything.

  The overlay uses a CSS clip-path animation via Framer's motion.div:

  const irisVariants \= {  
    initial: { clipPath: 'circle(100% at 19% 12%)' },  
    animate: {  
      clipPath: 'circle(0% at 19% 12%)',  
      transition: {  
        duration: 1.2,  
        ease: \[0.76, 0, 0.24, 1\],  
        delay: 0.1  
      }  
    },  
    exit: { opacity: 0, transition: { duration: 0.2 } }  
  }

  The clip center (19% 12%) aligns with the KvH logo position in the left column.  
  Background of overlay: \#0A0B0F with the kvhlogo.png centered at 72px.  
    
  After animation completes (onAnimationComplete), set a state flag  
  \`irisComplete: true\` that triggers all child reveal animations.  
  Remove overlay from DOM via AnimatePresence exit, not display:none.

═══════════════════════════════════════════════  
SECTION 5: FRAMER MOTION — CONTENT REVEAL SEQUENCE  
═══════════════════════════════════════════════

Use Framer's orchestration pattern: parent variants with staggerChildren.  
Pass \`irisComplete\` as a boolean — only animate when true.

PARENT CONTAINER VARIANTS (LeftColumn, RightColumn):  
  const containerVariants \= {  
    hidden: {},  
    visible: {  
      transition: {  
        staggerChildren: 0.15,  
        delayChildren: 0.0   // LeftColumn: 0s, RightColumn: 0.3s  
      }  
    }  
  }

CHILD ITEM VARIANTS (all text, counters, cards):  
  const itemVariants \= {  
    hidden: { opacity: 0, y: 18 },  
    visible: {  
      opacity: 1,  
      y: 0,  
      transition: {  
        duration: 0.6,  
        ease: \[0.22, 1, 0.36, 1\]   // custom ease-out-expo  
      }  
    }  
  }

PILLAR CARD VARIANTS — use clip-path wipe instead of fade:  
  const pillarVariants \= {  
    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },  
    visible: {  
      clipPath: 'inset(0 0% 0 0)',  
      opacity: 1,  
      transition: {  
        duration: 0.65,  
        ease: \[0.22, 1, 0.36, 1\]  
      }  
    }  
  }

LOGO VARIANT — scale \+ fade:  
  const logoVariants \= {  
    hidden: { opacity: 0, scale: 0.88 },  
    visible: {  
      opacity: 1,  
      scale: 1,  
      transition: {  
        duration: 0.7,  
        ease: \[0.34, 1.56, 0.64, 1\]  // spring overshoot — subtle bounce  
      }  
    }  
  }

═══════════════════════════════════════════════  
SECTION 6: FRAMER MOTION — COUNTER ANIMATION  
═══════════════════════════════════════════════

CounterUnit.jsx — use useMotionValue \+ useTransform \+ animate():

  import { useMotionValue, useTransform, animate, motion } from 'framer-motion'  
  import { useEffect } from 'react'

  const count \= useMotionValue(0)  
  const rounded \= useTransform(count, v \=\> Math.round(v))

  useEffect(() \=\> {  
    if (\!irisComplete) return  
    const controls \= animate(count, targetValue, {  
      duration: 1.4,  
      delay: 0.6,  
      ease: \[0.25, 1, 0.5, 1\]   // ease-out-quart  
    })  
    return controls.stop  
  }, \[irisComplete\])

  Render: \<motion.span\>{rounded}\</motion.span\>  
    
  Display as: \[number\]\[+suffix\] — e.g., "10+"  
  The "+" and year label are static text beside the animated motion.span.  
    
  Layout per counter:  
    Large: Cormorant Garamond 600, gold, clamp(2rem, 4vw, 3.5rem)  
    Label: DM Sans 300, text-muted, 0.65rem, letter-spacing 0.12em, uppercase

═══════════════════════════════════════════════  
SECTION 7: FRAMER MOTION — MAGNETIC BUTTON  
═══════════════════════════════════════════════

MagneticButton.jsx — physics-based spring follows cursor:

  import { motion, useSpring, useMotionValue } from 'framer-motion'  
  import { useRef } from 'react'

  const x \= useMotionValue(0)  
  const y \= useMotionValue(0)

  const springConfig \= { stiffness: 150, damping: 15, mass: 0.1 }  
  const springX \= useSpring(x, springConfig)  
  const springY \= useSpring(y, springConfig)

  const handleMouseMove \= (e) \=\> {  
    const rect \= ref.current.getBoundingClientRect()  
    const dx \= e.clientX \- rect.left \- rect.width / 2  
    const dy \= e.clientY \- rect.top \- rect.height / 2  
    x.set(dx \* 0.35)  
    y.set(dy \* 0.35)  
  }

  const handleMouseLeave \= () \=\> {  
    x.set(0)  
    y.set(0)  
  }

  Render as:  
    \<div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}  
         className="p-\[80px\] \-m-\[80px\]"\> {/\* enlarged hit zone \*/}  
      \<motion.a  
        href="https://www.linkedin.com/in/kyle-van-heerden/"  
        style={{ x: springX, y: springY }}  
        whileHover={{ scale: 1.04 }}  
        whileTap={{ scale: 0.97 }}  
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}  
        className="...linkedin button styles..."  
      \>  
        Connect on LinkedIn  
      \</motion.a\>  
    \</div\>

  Disable on touch:  
    const isTouchDevice \= window.matchMedia('(pointer: coarse)').matches  
    if (isTouchDevice) skip spring logic, render plain \<a\>

═══════════════════════════════════════════════  
SECTION 8: FRAMER MOTION — PILLAR CARD HOVER  
═══════════════════════════════════════════════

PillarCard.jsx — spring physics on hover, not CSS transition:

  import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

  const cardY \= useSpring(0, { stiffness: 300, damping: 20 })  
  const cardGlow \= useSpring(0, { stiffness: 200, damping: 18 })

  const boxShadow \= useTransform(  
    cardGlow,  
    \[0, 1\],  
    \['0 0 0px rgba(201,168,76,0)', '0 0 40px rgba(201,168,76,0.12), 0 0 80px rgba(201,168,76,0.05)'\]  
  )

  const borderColor \= useTransform(  
    cardGlow,  
    \[0, 1\],  
    \['rgba(201,168,76,0.12)', 'rgba(201,168,76,0.50)'\]  
  )

  Render:  
    \<motion.div  
      style={{ y: cardY, boxShadow, borderColor }}  
      onHoverStart={() \=\> { cardY.set(-3); cardGlow.set(1) }}  
      onHoverEnd={() \=\> { cardY.set(0); cardGlow.set(0) }}  
      className="border rounded-lg p-6 backdrop-blur-sm bg-white/\[0.03\] cursor-default"  
    \>  
      {/\* Pillar number — slides up independently \*/}  
      \<motion.span  
        className="text-gold/30 font-serif font-light text-4xl"  
        whileHover={{ y: \-3 }}  
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}  
      \>  
        {number}  
      \</motion.span\>  
      ...  
    \</motion.div\>

  Each PillarCard receives: number, icon (SVG string), title, copy, tag

═══════════════════════════════════════════════  
SECTION 9: FRAMER MOTION — KvH SIGNATURE  
═══════════════════════════════════════════════

KvhSignature.jsx — path draw on scroll-enter:

  import { motion, useInView } from 'framer-motion'  
  import { useRef } from 'react'

  const ref \= useRef(null)  
  const isInView \= useInView(ref, { once: true, amount: 0.5 })

  const pathVariants \= {  
    hidden: { pathLength: 0, opacity: 0 },  
    visible: (delay) \=\> ({  
      pathLength: 1,  
      opacity: 1,  
      transition: {  
        pathLength: { duration: 0.9, ease: 'easeInOut', delay },  
        opacity:    { duration: 0.3, delay }  
      }  
    })  
  }

  Render (in an \<svg viewBox="0 0 70 40"\>):  
    \<motion.path  
      d="M 10,8 L 10,32 M 10,20 L 24,8 M 10,20 L 24,32"  
      variants={pathVariants} custom={0}  
      initial="hidden" animate={isInView ? 'visible' : 'hidden'}  
      stroke="\#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"  
    /\>  
    \<motion.path  
      d="M 28,14 L 34,28 L 40,14"  
      variants={pathVariants} custom={0.55}  
      initial="hidden" animate={isInView ? 'visible' : 'hidden'}  
      stroke="\#C9922A" strokeWidth="1.5" strokeLinecap="round" fill="none"  
    /\>  
    \<motion.path  
      d="M 44,8 L 44,32 M 44,20 L 56,20 M 56,8 L 56,32"  
      variants={pathVariants} custom={1.0}  
      initial="hidden" animate={isInView ? 'visible' : 'hidden'}  
      stroke="\#8B5E1A" strokeWidth="1.5" strokeLinecap="round" fill="none"  
    /\>

  Wrap in \<div ref={ref}\> to trigger useInView.

═══════════════════════════════════════════════  
SECTION 10: CUSTOM CURSOR (No Framer — pure rAF)  
═══════════════════════════════════════════════

CursorTracker.jsx — lerp cursor using requestAnimationFrame only.  
Framer Motion is NOT used here — rAF gives smoother sub-frame lerp.

  useMousePosition.js hook:  
    export function useMousePosition() {  
      const \[pos, setPos\] \= useState({ x: 0, y: 0 })  
      useEffect(() \=\> {  
        const handler \= (e) \=\> setPos({ x: e.clientX, y: e.clientY })  
        window.addEventListener('mousemove', handler)  
        return () \=\> window.removeEventListener('mousemove', handler)  
      }, \[\])  
      return pos  
    }

  CursorTracker.jsx:  
    const cursorRef \= useRef(null)  
    const current \= useRef({ x: 0, y: 0 })  
    const target \= useRef({ x: 0, y: 0 })  
      
    useEffect(() \=\> {  
      const onMove \= (e) \=\> { target.current \= { x: e.clientX, y: e.clientY } }  
      window.addEventListener('mousemove', onMove)  
        
      let raf  
      const loop \= () \=\> {  
        current.current.x \+= (target.current.x \- current.current.x) \* 0.12  
        current.current.y \+= (target.current.y \- current.current.y) \* 0.12  
        if (cursorRef.current) {  
          cursorRef.current.style.transform \=  
            \`translate(${current.current.x \- 18}px, ${current.current.y \- 18}px)\`  
        }  
        raf \= requestAnimationFrame(loop)  
      }  
      raf \= requestAnimationFrame(loop)  
      return () \=\> {  
        window.removeEventListener('mousemove', onMove)  
        cancelAnimationFrame(raf)  
      }  
    }, \[\])

  Cursor DOM:  
    \<div ref={cursorRef} className="  
      fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-\[1000\]  
      border border-gold/50 transition-\[width,height,opacity\] duration-300  
    "\>  
      \<div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-gold" /\>  
    \</div\>

  On interactive element hover: add/remove class 'cursor-expanded'  
  .cursor-expanded { width: 56px; height: 56px; border-color: rgba(201,168,76,0.25); }

═══════════════════════════════════════════════  
SECTION 11: CANVAS PARTICLE SYSTEM  
═══════════════════════════════════════════════

ParticleCanvas.jsx — useRef \+ useEffect, no Framer (canvas is imperative):

  const canvasRef \= useRef(null)

  useEffect(() \=\> {  
    const canvas \= canvasRef.current  
    const ctx \= canvas.getContext('2d')  
    canvas.width \= window.innerWidth  
    canvas.height \= window.innerHeight

    const COUNT \= window.innerWidth \< 768 ? 35 : 70  
    const particles \= Array.from({ length: COUNT }, () \=\> ({  
      x: Math.random() \* canvas.width,  
      y: Math.random() \* canvas.height,  
      vx: (Math.random() \- 0.5) \* 0.3,  
      vy: (Math.random() \- 0.5) \* 0.2,  
      size: Math.random() \* 1.5 \+ 0.5,  
      opacity: Math.random() \* 0.4 \+ 0.15,  
      phase: Math.random() \* Math.PI \* 2,  
      speed: Math.random() \* 0.4 \+ 0.15,  
    }))

    let time \= 0  
    let raf

    const draw \= () \=\> {  
      ctx.clearRect(0, 0, canvas.width, canvas.height)  
      time \+= 0.008

      particles.forEach(p \=\> {  
        p.x \+= p.vx  
        p.y \+= Math.sin(p.phase \+ time \* p.speed) \* 0.35  
        if (p.x \< 0\) p.x \= canvas.width  
        if (p.x \> canvas.width) p.x \= 0  
        if (p.y \< 0\) p.y \= canvas.height  
        if (p.y \> canvas.height) p.y \= 0

        ctx.beginPath()  
        ctx.arc(p.x, p.y, p.size, 0, Math.PI \* 2\)  
        ctx.fillStyle \= \`rgba(201, 146, 42, ${p.opacity})\`  
        ctx.fill()  
      })

      // Connection lines between nearby particles  
      for (let i \= 0; i \< particles.length; i++) {  
        for (let j \= i \+ 1; j \< particles.length; j++) {  
          const dx \= particles\[i\].x \- particles\[j\].x  
          const dy \= particles\[i\].y \- particles\[j\].y  
          const dist \= Math.sqrt(dx\*dx \+ dy\*dy)  
          if (dist \< 90\) {  
            ctx.beginPath()  
            ctx.moveTo(particles\[i\].x, particles\[i\].y)  
            ctx.lineTo(particles\[j\].x, particles\[j\].y)  
            ctx.strokeStyle \= \`rgba(201,168,76,${(1 \- dist/90) \* 0.055})\`  
            ctx.lineWidth \= 0.5  
            ctx.stroke()  
          }  
        }  
      }

      raf \= requestAnimationFrame(draw)  
    }

    draw()

    // Pause when tab hidden  
    const onVisibility \= () \=\> {  
      if (document.hidden) cancelAnimationFrame(raf)  
      else raf \= requestAnimationFrame(draw)  
    }  
    document.addEventListener('visibilitychange', onVisibility)

    return () \=\> {  
      cancelAnimationFrame(raf)  
      document.removeEventListener('visibilitychange', onVisibility)  
    }  
  }, \[\])

  Render:  
    \<canvas ref={canvasRef}  
      className="fixed inset-0 z-0 pointer-events-none" /\>

═══════════════════════════════════════════════  
SECTION 12: SINE WAVE BACKGROUND (Framer motion.svg)  
═══════════════════════════════════════════════

SineWaveLayer.jsx — animated SVG via motion:

  import { motion } from 'framer-motion'

  Generate 14 path elements inside a motion.g with continuous translateX:  
    
  const waveVariants \= {  
    animate: {  
      x: \[0, \-120, 0\],  
      transition: { duration: 22, ease: 'easeInOut', repeat: Infinity }  
    }  
  }

  const paths \= Array.from({ length: 14 }, (\_, i) \=\> {  
    const y \= 60 \+ i \* 7  
    const colors \= i \< 4 ? '\#E8C060' : i \< 9 ? '\#C9922A' : '\#8B5E1A'  
    const opacity \= i \< 4 ? 0.07 : i \< 9 ? 0.06 : 0.05  
    return { d: \`M \-100,${y} C 150,${y-50} 350,${y+50} 700,${y-20} C 900,${y-60} 1100,${y+30} 1400,${y}\`, color: colors, opacity }  
  })

  Render:  
    \<svg className="absolute bottom-0 left-0 w-\[60vw\] h-\[200px\] pointer-events-none z-10"  
         viewBox="0 0 800 200" preserveAspectRatio="none"\>  
      \<motion.g variants={waveVariants} animate="animate"\>  
        {paths.map((p, i) \=\> (  
          \<path key={i} d={p.d} stroke={p.color} strokeWidth="0.6"  
                fill="none" opacity={p.opacity} /\>  
        ))}  
      \</motion.g\>  
    \</svg\>

═══════════════════════════════════════════════  
SECTION 13: CONTENT — IDENTITY & LAYOUT  
═══════════════════════════════════════════════

App.jsx structure:  
  \<IrisReveal onComplete={() \=\> setIrisComplete(true)}\>  
    \<CursorTracker /\>  
    \<ParticleCanvas /\>  
    \<main className="relative z-20 min-h-screen bg-bg text-text-primary overflow-hidden"\>  
      \<div className="grid grid-cols-\[38%\_62%\] h-screen max-h-screen"\>  
        \<LeftColumn irisComplete={irisComplete} /\>  
        \<RightColumn irisComplete={irisComplete} /\>  
      \</div\>  
    \</main\>  
  \</IrisReveal\>

PROFILE PHOTO PLACEHOLDER (LeftColumn.jsx):  
  A 140px circle — styled monogram, NOT a broken img:  
    \<div className="w-\[140px\] h-\[140px\] rounded-full border border-gold/20  
                    bg-gradient-to-br from-surface to-bg flex items-center  
                    justify-center relative"\>  
      \<span className="font-serif font-light text-3xl text-gold/70"\>KvH\</span\>  
      {/\* Decorative ring — 2px gap outside \*/}  
      \<div className="absolute inset-\[-6px\] rounded-full border border-gold/10" /\>  
    \</div\>

  When user has a photo, replace with:  
    \<img src="/profile.webp" srcSet="/profile.webp 1x, /profile@2x.webp 2x"  
         alt="Kyle van Heerden" loading="eager" decoding="async"  
         className="w-\[140px\] h-\[140px\] rounded-full object-cover" /\>

VERTICAL CONNECTOR (RightColumn.jsx):  
  An absolutely-positioned 1px vertical line runs the full height of the  
  pillar section's left edge:  
    \<div className="absolute left-0 top-4 bottom-4 w-px  
                    bg-gradient-to-b from-transparent via-gold/25 to-transparent" /\>

HERO TEXT BLOCK:  
  Name: Cormorant Garamond 300, clamp(2.2rem, 5vw, 4.8rem), text-text-primary  
  Role: DM Sans 500, clamp(0.7rem, 1.5vw, 1rem), text-gold, tracking-\[0.18em\], uppercase  
  Sub: DM Sans 300, clamp(0.7rem, 1.2vw, 0.85rem), text-text-muted, italic  
  Gold divider: \<div className="w-12 h-px bg-gold/40 my-4" /\>

═══════════════════════════════════════════════  
SECTION 14: CONTENT — THREE PILLARS  
═══════════════════════════════════════════════

pillarsData array (define in RightColumn.jsx or a data file):

\[  
  {  
    number: '01',  
    title: 'Clinical Foundation',  
    icon: 'M 0,12 L 8,12 L 12,4 L 16,20 L 20,12 L 28,12',  // EKG path  
    copy: \`A decade in clinical orthopaedics means I've stood on both sides  
           of the consultation. I translate complex science into commercial  
           strategy because I've lived the science first.\`,  
    tag: '10 Years · Orthopaedic Practice',  
    iconColor: '\#C9A84C'  
  },  
  {  
    number: '02',  
    title: 'Strategic Execution',  
    icon: 'M 0,18 L 8,14 L 16,8 L 24,4',  // trend line  
    copy: \`End-to-end ownership of Rx/OTC pharmaceutical portfolios —  
           from regulatory navigation to channel activation.  
           Strategy that survives contact with reality.\`,  
    tag: 'Pharmaceutical · Rx/OTC · Regulatory',  
    iconColor: '\#C9922A'  
  },  
  {  
    number: '03',  
    title: 'Digital Architecture',  
    icon: 'M 4,16 C 4,16 12,4 20,16 C 20,16 28,28 36,16',  // node-network S curve  
    copy: \`Building digital-first ecosystems for HCP engagement, pharmacy  
           activation, and healthcare compliance. The infrastructure that  
           connects the consultation room to the dispensing counter.\`,  
    tag: 'HCP Engagement · Pharmacy · Compliance',  
    iconColor: '\#8B5E1A'  
  }  
\]

PillarCard renders each item using motion variants from Section 8\.

═══════════════════════════════════════════════  
SECTION 15: COUNTER DATA  
═══════════════════════════════════════════════

countersData array:  
\[  
  { value: 10, suffix: '+', label: 'Years Professional' },  
  { value: 5,  suffix: '+', label: 'Years Clinical' },  
  { value: 3,  suffix: '',  label: 'Digital Ecosystems' }  
\]

Layout: flex row, evenly spaced, left column below the gold divider.

═══════════════════════════════════════════════  
SECTION 16: LINKEDIN CTA BUTTON DESIGN  
═══════════════════════════════════════════════

Inside MagneticButton.jsx:  
  Desktop:  
    Pill button, background: rgba(201,168,76,0.1)  
    Border: 1px solid rgba(201,168,76,0.4)  
    Text: DM Sans 400, 0.85rem, tracking-\[0.12em\], uppercase, text-gold  
    Padding: py-3 px-8  
    Hover: background lifts to rgba(201,168,76,0.18)  
    Left icon: small LinkedIn SVG (16×16, inline)

  Mobile (fixed thumb-zone):  
    position: fixed, bottom: 1.5rem, left: 50%, translateX(-50%)  
    width: calc(100% \- 3rem), max-width: 380px  
    border-radius: 100px (full pill)  
    backdrop-filter: blur(12px)  
    background: rgba(10,11,15,0.7) — semi-transparent dark with blur  
    border: 1px solid rgba(201,168,76,0.45)  
    z-index: 50

═══════════════════════════════════════════════  
SECTION 17: MOBILE LAYOUT (\<768px)  
═══════════════════════════════════════════════

Switch grid to single column:  
  className="grid grid-cols-1 md:grid-cols-\[38%\_62%\]"

Order on mobile (use Tailwind order utilities):  
  1\. Logo \+ name \+ sub-heading  
  2\. Gold divider  
  3\. Counters (3-across grid)  
  4\. Pillar cards (stacked, full width)  
  5\. KvH Signature  
  6\. Spacer for fixed CTA (pb-28)

Remove height constraint on mobile:  
  className="min-h-screen md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden"

Particle canvas: reduce COUNT to 35 on mobile (already handled in Section 11).  
Cursor: skip entirely on pointer:coarse (already handled in Section 10).  
Sine waves: reduce opacity to 0.04 on mobile.

useReducedMotion.js:  
  export const useReducedMotion \= () \=\>  
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  Import in App.jsx. If true, disable iris reveal (show content immediately),  
  disable particle canvas, disable counter animation (show final values static).  
  Framer Motion also auto-respects this via its own internal check.

═══════════════════════════════════════════════  
SECTION 18: PERFORMANCE REQUIREMENTS  
═══════════════════════════════════════════════

Vite build optimizations:  
  \- Framer Motion tree-shaken to only used features (Vite handles this)  
  \- manualChunks splits framer-motion into its own chunk (already in vite.config.js)  
  \- @fontsource loads only the weights specified (no full font bundle)  
  \- kvhlogo.png: optimize to WebP before deploy (use vite-imagetools or manual)  
    Target: \< 15KB at 144px display size

Web Vitals targets:  
  LCP (Largest Contentful Paint): \< 1.2s (iris reveal starts instantly)  
  CLS (Cumulative Layout Shift): 0 (all elements have fixed dimensions)  
  FID/INP: \< 50ms (no blocking JS, all animations on compositor thread)

Animation performance rules:  
  \- ONLY animate transform and opacity (compositor thread \= no layout thrash)  
  \- NO animation of width, height, top, left, margin, padding  
  \- Canvas: cancelAnimationFrame on visibilitychange (already in Section 11\)  
  \- Add will-change: transform to: cursor div, pillar cards, CTA button  
  \- Framer Motion's useSpring runs on the JS thread — that's fine for 3 springs

Font loading:  
  In index.html \<head\>:  
    \<link rel="preconnect" href="https://fonts.googleapis.com"\>  
    \<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin\>  
  (or preload the @fontsource woff2 files directly since they're bundled)

═══════════════════════════════════════════════  
SECTION 19: IDENTITY CONTENT (final copy)  
═══════════════════════════════════════════════

Name:        Kyle van Heerden  
Logo:        /public/kvhlogo.png — display at 72×72px desktop, 56×56px mobile  
             CSS: filter: drop-shadow(0 0 10px rgba(201,168,76,0.25))  
Hero title:  "Marketing Leadership in Modern Healthcare"  
Sub-heading: "Insight-Led. Impact-Focused. Growth-Driven."  
LinkedIn:    https://www.linkedin.com/in/kyle-van-heerden/  
CTA label:   "Connect on LinkedIn"

Signature tagline (below KvH SVG signature):  
  "Kyle van Heerden"  
  Font: Cormorant Garamond 300, text-gold/40, tracking-\[0.3em\], text-xs, uppercase

═══════════════════════════════════════════════  
SECTION 20: DELIVERABLES CHECKLIST  
═══════════════════════════════════════════════

Claude Code must produce ALL of the following files:

  □ package.json (with all dependencies listed above)  
  □ vite.config.js  
  □ tailwind.config.js  
  □ index.html (with preconnect, meta viewport, title "Kyle van Heerden")  
  □ src/main.jsx  
  □ src/App.jsx  
  □ src/index.css  
  □ src/components/IrisReveal.jsx  
  □ src/components/CursorTracker.jsx  
  □ src/components/ParticleCanvas.jsx  
  □ src/components/SineWaveLayer.jsx  
  □ src/components/LeftColumn.jsx  
  □ src/components/RightColumn.jsx  
  □ src/components/PillarCard.jsx  
  □ src/components/CounterUnit.jsx  
  □ src/components/MagneticButton.jsx  
  □ src/components/KvhSignature.jsx  
  □ src/hooks/useMousePosition.js  
  □ src/hooks/useReducedMotion.js

VALIDATION BEFORE OUTPUT:  
  □ No prop-types errors — all components receive their required props  
  □ No key-prop warnings — all mapped elements have unique key  
  □ IrisReveal properly removed from DOM post-animation (not display:none)  
  □ Canvas does not cause page scrollbars (fixed \+ pointer-events:none)  
  □ Mobile CTA does not obscure last content (pb-28 on mobile container)  
  □ All motion.path elements have fill="none" — SVG default fills black  
  □ useInView triggers only once (once: true) — no re-animation on scroll up  
  □ Particle canvas paused when tab is not visible  
  □ Framer springs have explicit stiffness/damping — no defaults  
  □ All text uses fluid clamp() sizing — no fixed px font sizes on hero elements

═══════════════════════════════════════════════  
SECTION — PHOTO ASSETS & DEPLOYMENT STRATEGY  
═══════════════════════════════════════════════

Three photos are available in the project's /public/photos/ directory:  
  /public/photos/kyle1.jpg  — Casual navy sweater, grey background, head+torso  
  /public/photos/kyle2.jpg  — Speaker at podium, dark navy backdrop, blazer  
  /public/photos/kyle3.png  — Full executive: navy overcoat, city bridge, wide shot

These are REAL photographs — remove all placeholder divs from Section 13\.

──────────────────────────────────────────────  
PHOTO 1 — kyle1.jpg → HERO PROFILE CIRCLE  
──────────────────────────────────────────────

Location: LeftColumn.jsx, top of column, above the name block.

Render as a circular portrait with a layered gold ring treatment:

  \<div className="relative w-\[148px\] h-\[148px\]"\>  
    {/\* Outer decorative ring \*/}  
    \<div className="absolute inset-\[-8px\] rounded-full  
                    border border-gold/15 pointer-events-none" /\>  
    {/\* Inner glow ring \*/}  
    \<div className="absolute inset-\[-3px\] rounded-full  
                    border border-gold/25 pointer-events-none" /\>  
    {/\* Photo \*/}  
    \<img  
      src="/photos/kyle1.jpg"  
      srcSet="/photos/kyle1.jpg 1x, /photos/kyle1.jpg 2x"  
      alt="Kyle van Heerden"  
      loading="eager"  
      decoding="async"  
      className="w-full h-full rounded-full object-cover object-top"  
    /\>  
    {/\* Subtle gold overlay at bottom edge — blends photo into dark bg \*/}  
    \<div className="absolute inset-0 rounded-full  
                    bg-gradient-to-t from-bg/40 via-transparent to-transparent  
                    pointer-events-none" /\>  
  \</div\>

  object-position: object-top — crops from the top down so the face is always  
  visible regardless of the circular crop.  
    
  Wrap in motion.div using the logoVariants from Section 5:  
    initial="hidden" animate={irisComplete ? 'visible' : 'hidden'}

──────────────────────────────────────────────  
PHOTO 2 — kyle2.jpg → RIGHT COLUMN BACKGROUND PANEL  
──────────────────────────────────────────────

Location: RightColumn.jsx — used as an atmospheric background layer  
behind the three pillar cards, NOT as a standalone image element.

The dark navy backdrop of kyle2.jpg blends almost perfectly into \#0A0B0F.  
Use it as a positioned background that creates depth without competing  
with the card content.

  \<div className="relative h-full"\>  
    {/\* Background photo layer \*/}  
    \<div className="absolute inset-0 overflow-hidden"\>  
      \<img  
        src="/photos/kyle2.jpg"  
        alt=""  
        aria-hidden="true"  
        loading="lazy"  
        className="w-full h-full object-cover object-center opacity-\[0.12\]  
                   scale-105"  
        style={{ filter: 'grayscale(30%) contrast(1.1)' }}  
      /\>  
      {/\* Dark vignette over photo — ensures text contrast \*/}  
      \<div className="absolute inset-0  
                      bg-gradient-to-r from-bg/95 via-bg/70 to-bg/90" /\>  
      {/\* Top and bottom fade \*/}  
      \<div className="absolute inset-0  
                      bg-gradient-to-b from-bg/80 via-transparent to-bg/80" /\>  
    \</div\>

    {/\* Pillar cards render on top of this — z-10 relative \*/}  
    \<div className="relative z-10 h-full flex flex-col justify-center gap-4 p-8"\>  
      {/\* pillarsData.map(...) \*/}  
    \</div\>  
  \</div\>

  opacity-\[0.12\] keeps it subliminal — the viewer's eye registers  
  "there's a person here" before the conscious mind processes it.  
  This is the psychological anchor that solves the "authority gap."

──────────────────────────────────────────────  
PHOTO 3 — kyle3.png → IRIS REVEAL BACKDROP  
──────────────────────────────────────────────

Location: IrisReveal.jsx — shown DURING the iris animation, then  
replaced by the main page content as the iris contracts.

kyle3.png has a natural leading-line composition (the bridge recedes  
to a vanishing point behind Kyle). This creates a subconscious depth  
cue that makes the iris "open onto" something.

  Inside IrisReveal.jsx, the overlay div contains:

  \<motion.div  
    variants={irisVariants}  
    initial="initial"  
    animate="animate"  
    onAnimationComplete={onComplete}  
    className="fixed inset-0 z-50 overflow-hidden"  
    style={{ backgroundColor: '\#0A0B0F' }}  
  \>  
    {/\* Full-bleed photo — visible during iris contraction \*/}  
    \<img  
      src="/photos/kyle3.png"  
      alt=""  
      aria-hidden="true"  
      className="absolute inset-0 w-full h-full object-cover object-center  
                 opacity-30"  
      style={{ filter: 'grayscale(20%) contrast(1.05)' }}  
    /\>  
    {/\* Dark overlay to keep the iris opening readable \*/}  
    \<div className="absolute inset-0 bg-bg/65" /\>  
    {/\* KvH logo centered — the iris appears to open FROM the logo \*/}  
    \<div className="absolute inset-0 flex items-center justify-center"\>  
      \<img  
        src="/kvhlogo.png"  
        alt="KvH"  
        className="w-20 h-20 opacity-90"  
        style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }}  
      /\>  
    \</div\>  
  \</motion.div\>

  The iris clip-path origin (19% 12%) targets the logo position in the  
  LEFT column — so the iris appears to contract toward where the logo  
  will sit in the final layout. This creates spatial continuity.

──────────────────────────────────────────────  
IMAGE OPTIMIZATION INSTRUCTIONS  
──────────────────────────────────────────────

Before deploying, optimize photos for web performance:

  kyle1.jpg — Hero profile circle (148px display size):  
    Target: 300×300px WebP, quality 85, \< 25KB  
    Command: convert kyle1.jpg \-resize 300x300^ \-gravity north  
             \-extent 300x300 \-quality 85 kyle1.webp

  kyle2.jpg — Background panel (full column height, low opacity):  
    Target: 800×1000px WebP, quality 70, \< 60KB (opacity hides compression)  
    Command: convert kyle2.jpg \-resize 800x1000^ \-quality 70 kyle2.webp

  kyle3.png — Iris backdrop (full screen, 30% opacity):  
    Target: 1200×1600px WebP, quality 75, \< 120KB  
    Command: convert kyle3.png \-resize 1200x1600^ \-quality 75 kyle3.webp

  Update all src paths to .webp after optimization.  
  Add srcSet for 2x displays on kyle1 (hero circle) only — it's the only  
  image that will be viewed at high zoom on retina phones.

  If ImageMagick is unavailable, use vite-imagetools:  
    npm install vite-imagetools  
    import kyle1 from '/photos/kyle1.jpg?w=300\&format=webp\&quality=85'

──────────────────────────────────────────────  
RESPONSIVE PHOTO BEHAVIOR  
──────────────────────────────────────────────

Mobile (\< 768px):  
  kyle1.jpg (profile circle): reduce to 112×112px, keep object-top crop  
  kyle2.jpg (right column bg): disable entirely on mobile — single column  
    layout means the panel no longer has a right column background layer.  
    Replace with a simple surface color (\#12141A).  
  kyle3.png (iris reveal): retain at full screen. Mobile users experience  
    the same cinematic opening — it's worth the slightly larger load on  
    first paint because it sets the premium tone immediately.

  Add to RightColumn.jsx:  
    className="md:relative" (remove background handling on mobile)  
  The kyle2 img tag: className="hidden md:block absolute inset-0 ..."

──────────────────────────────────────────────  
ALT TEXT & ACCESSIBILITY  
──────────────────────────────────────────────

  kyle1.jpg: alt="Kyle van Heerden" (descriptive — this is the identity photo)  
  kyle2.jpg: alt="" aria-hidden="true" (decorative — screen readers skip it)  
  kyle3.png: alt="" aria-hidden="true" (decorative — iris backdrop only)

  The profile circle (kyle1) is the only image that carries semantic meaning.  
  Decorative images must have empty alt="" to avoid screen reader noise.

═══════════════════════════════════════════════  
SECTION — SEO, META & STRUCTURED DATA  
═══════════════════════════════════════════════

INDEX.HTML — complete \<head\> block:

  \<meta charset="UTF-8" /\>  
  \<meta name="viewport" content="width=device-width,  
        initial-scale=1, viewport-fit=cover" /\>  
  \<\!-- viewport-fit=cover enables safe-area-inset on iPhone \--\>

  \<title\>Kyle van Heerden — Healthcare Marketing Leadership\</title\>  
  \<meta name="description"  
    content="Senior pharmaceutical marketing executive bridging  
    clinical orthopaedics and digital healthcare strategy.  
    10+ years of insight-led, impact-focused growth." /\>  
  \<meta name="author" content="Kyle van Heerden" /\>  
  \<link rel="canonical" href="https://kylevanheerden.com" /\>  
  \<\!-- Replace with actual deployed domain \--\>

  \<\!-- Open Graph (LinkedIn preview when someone shares the link) \--\>  
  \<meta property="og:type"        content="profile" /\>  
  \<meta property="og:title"       content="Kyle van Heerden" /\>  
  \<meta property="og:description" content="Marketing Leadership  
    in Modern Healthcare. Insight-Led. Impact-Focused." /\>  
  \<meta property="og:image"       content="/photos/kyle3.png" /\>  
  \<meta property="og:url"         content="https://kylevanheerden.com" /\>  
  \<meta property="profile:first\_name" content="Kyle" /\>  
  \<meta property="profile:last\_name"  content="van Heerden" /\>

  \<\!-- Twitter/X card (controls preview when link shared on X) \--\>  
  \<meta name="twitter:card"        content="summary\_large\_image" /\>  
  \<meta name="twitter:title"       content="Kyle van Heerden" /\>  
  \<meta name="twitter:description" content="Marketing Leadership  
    in Modern Healthcare." /\>  
  \<meta name="twitter:image"       content="/photos/kyle3.png" /\>

  \<\!-- Favicon (use KvH logo, converted to .ico or .svg) \--\>  
  \<link rel="icon" type="image/png" href="/kvhlogo.png" /\>  
  \<link rel="apple-touch-icon"      href="/kvhlogo.png" /\>

SEMANTIC HTML REQUIREMENTS (critical for SEO):

  App.jsx must use semantic elements, NOT div soup:  
    \<main\>       wraps the entire page grid  
    \<header\>     wraps LeftColumn logo \+ name block  
    \<h1\>         Kyle van Heerden (the name — only one h1 per page)  
    \<p\>          the role headline and sub-heading  
    \<section\>    wraps the three pillars (aria-label="Experience")  
    \<article\>    each individual PillarCard  
    \<h2\>         each pillar title (Clinical Foundation, etc.)  
    \<footer\>     wraps the KvH signature \+ tagline  
    \<nav\>        wraps the LinkedIn CTA (aria-label="Contact")

  This semantic structure means Google understands:  
    \- Who the page is about (h1)  
    \- What they do (h2s in the pillar articles)  
    \- How to contact them (nav)

JSON-LD STRUCTURED DATA (inject in index.html \<head\>):

  \<script type="application/ld+json"\>  
  {  
    "@context": "https://schema.org",  
    "@type": "Person",  
    "name": "Kyle van Heerden",  
    "jobTitle": "Pharmaceutical Marketing Executive",  
    "description": "Senior marketing professional bridging clinical  
      orthopaedics and pharmaceutical digital strategy.",  
    "url": "https://kylevanheerden.com",  
    "sameAs": \[  
      "https://www.linkedin.com/in/kyle-van-heerden/"  
    \],  
    "knowsAbout": \[  
      "Pharmaceutical Marketing",  
      "Clinical Orthopaedics",  
      "Healthcare Digital Strategy",  
      "Rx/OTC Product Marketing",  
      "HCP Engagement"  
    \],  
    "image": "https://kylevanheerden.com/photos/kyle3.png"  
  }  
  \</script\>

  This schema makes the page eligible for a Google Knowledge Panel  
  — the sidebar card that appears when someone searches a person's name.

MOBILE SAFE AREA FIX (iPhone notch/home bar):

  Fixed LinkedIn CTA — add to its className:  
    pb-\[env(safe-area-inset-bottom)\]  
  Or in CSS:  
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));

  This prevents the button from sitting behind the iPhone home indicator.

IRIS REVEAL — MOBILE PERFORMANCE FALLBACK:

  In IrisReveal.jsx, before defining irisVariants:  
    const isMobile \= window.innerWidth \< 768  
    const prefersReduced \= window.matchMedia(  
      '(prefers-reduced-motion: reduce)').matches

  If isMobile OR prefersReduced, replace irisVariants with:  
    const irisVariants \= {  
      initial: { opacity: 0 },  
      animate: {  
        opacity: 1,  
        transition: { duration: 0.6, ease: 'easeOut' }  
      }  
    }  
  — simple fade replaces the clip-path iris on mobile  
  — eliminates GPU stutter on mid-range Android devices  
  — iris experience preserved for desktop where it will always be smooth

PERFORMANCE BUDGET:

  Run Lighthouse after build. Minimum acceptable scores:  
    Performance:    90+  
    Accessibility:  95+  (semantic HTML \+ alt text gets you here)  
    Best Practices: 95+  
    SEO:            100  (meta tags \+ structured data gets you here)

  If Performance score is below 90, the first fix is always:  
    1\. Reduce particle COUNT to 40 desktop / 20 mobile  
    2\. Add loading="lazy" to kyle2.jpg and kyle3.png  
    3\. Ensure fonts use font-display: swap (already in @fontsource)

═══════════════════════════════════════════════  
SECTION — DEPLOYMENT: kylevanheerden.com  
═══════════════════════════════════════════════

DOMAIN: kylevanheerden.com (owned, DNS management available)

**DEPLOYMENT STEPS (Claude Code should scaffold these files):**

**1\. Create `_redirects` file in `public/` folder:**

This is the Cloudflare equivalent of Vercel rewrites for React SPAs.

Plaintext  
/\*    /index.html   200

**2\. Create `_headers` file in `public/` folder:**

Optimizes asset delivery and security.

Plaintext  
/assets/\*  
  Cache-Control: public, max-age=31536000, immutable  
/photos/\*  
  Cache-Control: public, max-age=86400

**3\. Update `package.json` scripts:**

JSON  
"scripts": {  
  "dev": "vite",  
  "build": "vite build",  
  "preview": "vite preview",  
  "deploy": "wrangler pages deploy dist"  
}

**CLOUDFLARE PAGES CONFIGURATION (Manual Steps):**

1. **Connect Repository:** In the Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.  
2. **Build Settings:**  
   * **Framework preset:** `Vite`  
   * **Build command:** `npm run build`  
   * **Build output directory:** `dist`  
3. **Custom Domain:**  
   * Go to **Pages Project** → **Custom domains**.  
   * Add `kylevanheerden.com`. Cloudflare will automatically update your DNS CNAME records since they already manage your domain.

**POST-DEPLOY VALIDATION:**

* **Check Canonical URL:** Ensure `kylevanheerden.com` is the primary domain.  
* **Page Speed:** Run a Lighthouse audit. Because you are using **Vite \+ React \+ Framer Motion**, the "Performance" score should be 90+.  
* **OG Preview:** Use `[https://www.opengraph.xyz](https://www.opengraph.xyz)` to verify your professional headshot appears correctly in social links.  
* **Search Console:** Submit `[https://kylevanheerden.com/sitemap.xml](https://kylevanheerden.com/sitemap.xml)` to Google Search Console to ensure your 10 years of experience is indexed correctly.

SITEMAP: Add public/sitemap.xml (single-page site): \<?xml version="1.0" encoding="UTF-8"?\> \<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\> \<url\> \<loc\>https://kylevanheerden.com\</loc\> \<lastmod\>2025-01-01\</lastmod\> \<changefreq\>monthly\</changefreq\> \<priority\>1.0\</priority\> \</url\> \</urlset\> ROBOTS.TXT: Add public/robots.txt: User-agent: \* Allow: / Sitemap: https://kylevanheerden.com/sitemap.xml GOOGLE SEARCH CONSOLE SETUP (after deploy): 1\. Go to search.google.com/search-console 2\. Add property: kylevanheerden.com 3\. Verify via DNS TXT record (Vercel makes this easy) 4\. Submit sitemap URL: https://kylevanheerden.com/sitemap.xml 5\. Request indexing on the URL Inspection tool — First index typically within 48-72 hours — With the JSON-LD Person schema, eligible for Knowledge Panel within 2-4 weeks of consistent indexing 

---

**SITEMAP & ROBOTS:** (Keep existing XML/TXT logic from your previous draft as they are platform-agnostic).

