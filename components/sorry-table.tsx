'use client'

import { useRef, useState } from 'react'
import { sorries, type Sorry } from '@/lib/sorries'
import { HEART_GAME_AT, milestones, prefersReducedMotion } from '@/lib/journey'
import { HeartGame } from './heart-game'
import { useJourney } from './journey-provider'
import { ProgressBar } from './progress-bar'
import { SorryCard } from './sorry-card'
import { SorryPostcard } from './sorry-postcard'

export function SorryTable() {
  const [selected, setSelected] = useState<Sorry | null>(null)
  const [milestone, setMilestone] = useState<string | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'open' | 'done'>('idle')
  const { discovered, discover, paperSound, setCalm } = useJourney()
  const milestoneTimer = useRef<number | undefined>(undefined)
  const pendingScroll = useRef(false)

  const showMilestone = (text: string) => {
    window.clearTimeout(milestoneTimer.current)
    setMilestone(text)
    milestoneTimer.current = window.setTimeout(() => setMilestone(null), 3600)
  }

  const open = (sorry: Sorry) => {
    const wasNew = !discovered.has(sorry.id)
    const count = discover(sorry.id)
    paperSound()
    if (sorry.id === 50) setCalm(true)
    if (wasNew && milestones[count]) showMilestone(milestones[count])
    if (wasNew && count === 50) pendingScroll.current = true
    setSelected(sorry)
  }

  const close = () => {
    setSelected(null)
    setCalm(false)
    if (pendingScroll.current) {
      pendingScroll.current = false
      window.setTimeout(
        () => {
          document
            .getElementById('one-message')
            ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
        },
        1600,
      )
      return
    }
    if (gameState === 'idle' && discovered.size >= HEART_GAME_AT) setGameState('open')
  }

  return (
    <section
      id="notes"
      aria-labelledby="notes-heading"
      className="fade-when-quiet mx-auto max-w-7xl scroll-mt-4 px-5 pb-24 md:px-10"
    >
      <h2 id="notes-heading" className="sr-only">
        Fifty little notes saying sorry
      </h2>
      <ProgressBar count={discovered.size} milestone={milestone} />
      <ul className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-7 md:grid-cols-4 md:gap-x-6 md:gap-y-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-12">
        {sorries.map((sorry, i) => (
          <SorryCard key={sorry.id} sorry={sorry} index={i} onOpen={open} discovered={discovered.has(sorry.id)} />
        ))}
      </ul>
      <SorryPostcard sorry={selected} onClose={close} />
      <HeartGame open={gameState === 'open'} onDone={() => setGameState('done')} />
    </section>
  )
}
