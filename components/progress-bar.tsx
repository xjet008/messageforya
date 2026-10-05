'use client'

import { useState } from 'react'
import { Heart, Volume2, VolumeX } from 'lucide-react'
import { FORGIVE_PROMPT_AT, TOTAL_CARDS } from '@/lib/journey'
import { useJourney } from './journey-provider'

type Props = {
  count: number
  milestone: string | null
}

export function ProgressBar({ count, milestone }: Props) {
  const { soundOn, toggleSound } = useJourney()
  const [forgive, setForgive] = useState<0 | 1 | 2 | 3>(0)
  const showForgive = count >= FORGIVE_PROMPT_AT && forgive < 3

  const onForgive = () => {
    if (forgive === 0) setForgive(1)
    else if (forgive === 1) {
      setForgive(2)
      window.setTimeout(() => setForgive(3), 2600)
    }
  }

  return (
    <div className="sticky top-3 z-20 mb-10 flex justify-center md:mb-14">
      <div className="paper-card relative flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-sm border border-border px-5 py-2.5 shadow-sm">
        <p className="flex items-center gap-2 text-xs tracking-[0.25em] text-foreground/80 uppercase md:text-sm">
          <Heart aria-hidden="true" className="size-3 fill-accent text-accent" />
          <span>
            Apologies delivered:{' '}
            <span className="font-medium text-foreground tabular-nums">
              {count} / {TOTAL_CARDS}
            </span>
          </span>
        </p>

        <span aria-hidden="true" className="hidden h-4 w-px border-l border-dashed border-foreground/30 sm:block" />

        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          className="flex min-h-8 items-center gap-1.5 rounded-full px-2 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {soundOn ? <Volume2 aria-hidden="true" className="size-3.5" /> : <VolumeX aria-hidden="true" className="size-3.5" />}
          <span>Paper sound {soundOn ? 'on' : 'off'}</span>
        </button>

        <div aria-live="polite" className="pointer-events-none absolute top-full left-1/2 mt-2 w-max max-w-[85vw] -translate-x-1/2 text-center">
          {milestone && (
            <p key={milestone} className="milestone-pop paper-card -rotate-2 rounded-sm border border-border px-4 py-1 font-hand text-2xl text-accent shadow-md">
              {milestone}
            </p>
          )}
        </div>

        {showForgive && (
          <div className="absolute top-1/2 left-full ml-4 hidden w-max -translate-y-1/2 flex-col items-start lg:flex">
            <ForgiveButton stage={forgive} onClick={onForgive} />
          </div>
        )}
      </div>

      {showForgive && (
        <div className="absolute top-full right-0 mt-14 lg:hidden">
          <ForgiveButton stage={forgive} onClick={onForgive} />
        </div>
      )}
    </div>
  )
}

function ForgiveButton({ stage, onClick }: { stage: number; onClick: () => void }) {
  return (
    <div className="rise-in flex flex-col items-end gap-0.5 lg:items-start">
      {stage < 2 && (
        <button
          type="button"
          onClick={onClick}
          className="forgive-btn min-h-10 rotate-3 rounded-full border border-dashed border-accent/60 bg-card/80 px-4 font-hand text-xl text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {stage === 0 ? 'forgive me? \u{1F97A}' : 'try again'}
        </button>
      )}
      <p aria-live="polite" className="-rotate-2 font-hand text-lg text-foreground/80">
        {stage === 1 && 'that was suspiciously easy \u{1F62D}'}
        {stage === 2 && 'okay okay\u2026 I\u2019ll earn it.'}
      </p>
    </div>
  )
}
