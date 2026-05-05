import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useAnimation } from 'framer-motion'

const LOGO_SIZE_DESKTOP = 88
const LOGO_SIZE_MOBILE  = 56

export default function LogoOrbit({ irisComplete }) {
  const placeholderRef  = useRef(null)
  const controls        = useAnimation()
  const [startPos, setStartPos] = useState(null)

  const isDesktop =
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

  // Capture placeholder position once iris reveal is done
  useEffect(() => {
    if (!irisComplete || !isDesktop) return
    const t = setTimeout(() => {
      if (!placeholderRef.current) return
      const r = placeholderRef.current.getBoundingClientRect()
      setStartPos({ top: r.top, left: r.left, w: r.width, h: r.height })
    }, 450)
    return () => clearTimeout(t)
  }, [irisComplete, isDesktop])

  // Full animation loop
  useEffect(() => {
    if (!startPos) return
    let dead = false
    const sleep = ms => new Promise(res => setTimeout(res, ms))

    const loop = async () => {
      // Let portal element mount
      await sleep(80)
      // Initial settle time after page reveal
      await sleep(1400)

      while (!dead) {
        // ── 3 pulses ──────────────────────────────────────────────
        for (let i = 0; i < 3; i++) {
          if (dead) return
          await controls.start(
            { scale: 1.22, filter: 'drop-shadow(0 0 34px rgba(201,168,76,1))' },
            { duration: 0.14, ease: 'easeOut' }
          )
          if (dead) return
          await controls.start(
            { scale: 1, filter: 'drop-shadow(0 0 7px rgba(201,168,76,0.18))' },
            { duration: 0.21, ease: 'easeIn' }
          )
          if (i < 2 && !dead) await sleep(80)
        }

        if (dead) return
        await sleep(160)

        // ── ZAP right off screen ───────────────────────────────────
        // Stretch horizontally (motion blur effect) and fade as it exits
        await controls.start(
          {
            x: window.innerWidth - startPos.left + 120,
            scaleX: 4.5,
            opacity: 0
          },
          { duration: 0.21, ease: [0.65, 0, 1, 0.4] }
        )

        if (dead) return

        // ── Teleport: place logo hidden, left of the profile photo ─
        // Profile photo is ~132 px wide + ~24 px gap to the left of the logo
        controls.set({ x: -(startPos.left + startPos.w + 20), scaleX: 1, opacity: 0 })

        if (dead) return

        // ── Glide out from behind the photo back to home ───────────
        await controls.start(
          { x: 0, opacity: 1 },
          { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
        )

        if (dead) return
        await sleep(4200)
      }
    }

    loop()
    return () => {
      dead = true
      controls.stop()
    }
  }, [startPos, controls])

  // ── Mobile: simple breathing glow, no travel ──────────────────────
  if (!isDesktop) {
    return (
      <motion.img
        src="/kvhlogotransparent.png"
        alt="KvH - Kyle van Heerden personal brand monogram"
        width={LOGO_SIZE_MOBILE}
        height={LOGO_SIZE_MOBILE}
        className="shrink-0"
        style={{ width: LOGO_SIZE_MOBILE, height: LOGO_SIZE_MOBILE }}
        animate={{
          scale: [1, 1.07, 1],
          filter: [
            'drop-shadow(0 0 5px rgba(201,168,76,0.15))',
            'drop-shadow(0 0 22px rgba(201,168,76,0.65))',
            'drop-shadow(0 0 5px rgba(201,168,76,0.15))'
          ]
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    )
  }

  return (
    <>
      {/* Invisible space-holder — keeps the flex layout intact */}
      <div
        ref={placeholderRef}
        style={{ width: LOGO_SIZE_DESKTOP, height: LOGO_SIZE_DESKTOP }}
        className="shrink-0"
        aria-hidden="true"
      />

      {/* Fixed-position clone rendered at <body> level so it escapes
          overflow:hidden and Framer transform stacking contexts */}
      {startPos && createPortal(
        <motion.img
          animate={controls}
          src="/kvhlogotransparent.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: startPos.top,
            left: startPos.left,
            width: startPos.w,
            height: startPos.h,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />,
        document.body
      )}
    </>
  )
}
