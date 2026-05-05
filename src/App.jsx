import { useState } from 'react'
import IrisReveal from './components/IrisReveal.jsx'
import CursorTracker from './components/CursorTracker.jsx'
import ParticleCanvas from './components/ParticleCanvas.jsx'
import LeftColumn from './components/LeftColumn.jsx'
import RightColumn from './components/RightColumn.jsx'
import { useReducedMotion } from './hooks/useReducedMotion.js'

export default function App() {
  const reducedMotion = useReducedMotion()
  const [irisComplete, setIrisComplete] = useState(reducedMotion)

  return (
    <IrisReveal onComplete={() => setIrisComplete(true)}>
      <CursorTracker />
      {!reducedMotion && <ParticleCanvas />}
      <main className="relative z-20 min-h-screen bg-bg text-text-primary overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[38%_62%] min-h-screen md:h-screen md:max-h-screen overflow-y-auto md:overflow-hidden">
          <LeftColumn irisComplete={irisComplete} />
          <RightColumn irisComplete={irisComplete} />
        </div>
        {/* Spacer so content clears the fixed mobile CTA pill */}
        <div className="h-28 md:hidden" />
      </main>
    </IrisReveal>
  )
}
