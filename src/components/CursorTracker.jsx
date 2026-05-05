import { useRef, useEffect } from 'react'

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

export default function CursorTracker() {
  const cursorRef = useRef(null)
  const current = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isTouchDevice) return

    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    let raf
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12
      current.current.y += (target.current.y - current.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${current.current.x - 18}px, ${current.current.y - 18}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onEnter = () => cursorRef.current?.classList.add('cursor-expanded')
    const onLeave = () => cursorRef.current?.classList.remove('cursor-expanded')

    const interactives = document.querySelectorAll('a, button, [role="button"]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[1000] border border-gold/50 transition-[width,height,opacity] duration-300"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-gold" />
    </div>
  )
}
