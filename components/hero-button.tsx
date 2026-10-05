'use client'

import { useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/journey'

const messages = ['', 'you really want to know? \u{1F440}', 'okay okay\u2026', 'come in \u{1FAF6}']

export function HeroButton() {
  const [stage, setStage] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const nudge = () => setStage((s) => (s < 2 ? s + 1 : s))

  const onClick = () => {
    setStage(3)
    window.clearTimeout(timer.current)
    const reduce = prefersReducedMotion()
    timer.current = window.setTimeout(
      () => {
        document.getElementById('notes')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      },
      reduce ? 0 : 650,
    )
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <p aria-live="polite" className="h-8 -rotate-2 font-hand text-2xl text-accent">
        {messages[stage]}
      </p>
      <button
        type="button"
        onClick={onClick}
        onPointerEnter={(e) => e.pointerType === 'mouse' && nudge()}
        onFocus={nudge}
        className="hero-cta paper-card group relative mt-2 inline-flex items-center gap-3 rounded-sm border border-foreground/60 px-7 py-3 font-serif text-xl italic outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <span>Open my apology</span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          {'\u2192'}
        </span>
        <Heart
          aria-hidden="true"
          className="cta-heart absolute -top-2.5 -right-2.5 size-5 fill-accent text-accent"
        />
      </button>
    </div>
  )
}
