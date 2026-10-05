'use client'

import { useEffect } from 'react'
import { IntroGate } from './intro-gate'
import { JourneyProvider, useJourney } from './journey-provider'

function Shell({ children }: { children: React.ReactNode }) {
  const { entered } = useJourney()

  useEffect(() => {
    document.documentElement.style.overflow = entered ? '' : 'hidden'
  }, [entered])

  return (
    <>
      <div aria-hidden="true" className="quiet-veil pointer-events-none fixed inset-0" />
      <main inert={!entered} data-entered={entered} className="site-reveal relative min-h-dvh overflow-x-hidden">
        {children}
      </main>
      <IntroGate />
    </>
  )
}

export function Experience({ children }: { children: React.ReactNode }) {
  return (
    <JourneyProvider>
      <Shell>{children}</Shell>
    </JourneyProvider>
  )
}
