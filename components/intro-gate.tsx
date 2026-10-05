'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/journey'
import { useJourney } from './journey-provider'

type Step = 'ask' | 'terms' | 'leaving' | 'gone'

const terms = [
  'I will read the whole thing',
  'I will tolerate the terrible jokes',
  'I understand that one sorry apparently wasn\u2019t enough',
  'I acknowledge that I am very special',
]

export function IntroGate() {
  const { enter } = useJourney()
  const [step, setStep] = useState<Step>('ask')
  const [lines, setLines] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [noClicks, setNoClicks] = useState(0)
  const [noShift, setNoShift] = useState<{ x: number; y: number } | null>(null)
  const [checked, setChecked] = useState(() => terms.map(() => true))
  const [accepted, setAccepted] = useState(false)
  const timers = useRef<number[]>([])
  const yesRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    yesRef.current?.focus()
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const toTerms = (delay: number) => {
    setLocked(true)
    later(delay, () => {
      setLines([])
      setStep('terms')
    })
  }

  const onYes = () => {
    if (locked) return
    setLines(['hmm\u2026 suspiciously confident.'])
    later(1000, () => setLines((l) => [...l, 'okay, you\u2019re cleared. \u{1F62D}']))
    toTerms(2300)
  }

  const onNo = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (locked) return
    const clicks = noClicks + 1
    setNoClicks(clicks)

    if (clicks === 1) {
      setLines(['interesting\u2026'])
      later(700, () => setLines((l) => [...l, 'then who are you? \u{1F480}']))
      if (!prefersReducedMotion()) {
        const rect = e.currentTarget.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const fromKeyboard = e.clientX === 0 && e.clientY === 0
        const dx = fromKeyboard ? 1 : cx - e.clientX
        const dy = fromKeyboard ? 0 : cy - e.clientY
        const len = Math.hypot(dx, dy) || 1
        setNoShift({ x: (dx / len) * 56, y: (dy / len) * 28 })
      }
    } else if (clicks === 2) {
      setLines(['girl I literally made this for you \u{1F62D}'])
    } else {
      setLines(['knew it. okay, you\u2019re cleared. \u{1F62D}'])
      toTerms(1200)
    }
  }

  const onAccept = () => {
    if (accepted) return
    setAccepted(true)
    later(900, () => {
      setStep('leaving')
      enter()
      later(prefersReducedMotion() ? 0 : 650, () => setStep('gone'))
    })
  }

  if (step === 'gone') return null

  const anyUnchecked = checked.some((c) => !c)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      data-leaving={step === 'leaving'}
      className="gate paper fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-10"
    >
      {step === 'ask' && (
        <div className="rise-in flex w-full max-w-xl flex-col items-center text-center">
          <p className="font-hand text-xl text-accent" style={{ transform: 'rotate(-3deg)' }}>
            a little letter, just for you
          </p>
          <h1 id="gate-title" className="mt-3 font-serif text-7xl leading-none font-medium tracking-tight italic md:text-8xl">
            {'WAIT\u2026'}
          </h1>
          <div className="mt-6 flex items-center gap-4" aria-hidden="true">
            <span className="h-px w-12 border-t border-dashed border-foreground/40" />
            <Heart className="size-3.5 fill-accent text-accent" />
            <span className="h-px w-12 border-t border-dashed border-foreground/40" />
          </div>
          <p className="mt-6 max-w-md font-serif text-2xl leading-snug text-pretty md:text-3xl">
            {'Before you continue, I need to make sure you\u2019re actually you. \u{1F440}'}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              ref={yesRef}
              type="button"
              onClick={onYes}
              className="gate-btn rounded-full border border-foreground/70 bg-foreground px-7 py-3 text-sm tracking-[0.2em] text-card uppercase"
            >
              Yes, obviously
            </button>
            <button
              type="button"
              onClick={onNo}
              className="gate-btn no-btn rounded-full border border-foreground/70 px-7 py-3 text-sm tracking-[0.2em] uppercase"
              style={noShift ? { transform: `translate(${noShift.x}px, ${noShift.y}px) rotate(4deg)` } : undefined}
            >
              {noClicks >= 2 ? 'okay fine, I\u2019m her' : 'No'}
            </button>
          </div>

          <div aria-live="polite" className="mt-8 flex min-h-20 flex-col items-center gap-1">
            {lines.map((line) => (
              <p key={line} className="rise-in font-hand text-2xl text-accent md:text-3xl">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {step !== 'ask' && (
        <div className="terms-in paper-card relative w-full max-w-md -rotate-1 rounded-sm border border-border p-3 shadow-xl">
          <div className="relative border border-dashed border-foreground/25 px-6 py-8 md:px-8">
            <div className="absolute top-4 right-4 flex size-12 rotate-6 items-center justify-center border border-dotted border-accent/60 text-accent">
              <Heart aria-hidden="true" className="size-4 fill-accent/80" />
            </div>
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Terms &amp; conditions</p>
            <h2 id="gate-title" className="mt-3 pr-12 font-serif text-3xl leading-tight italic">
              Before entering, please accept:
            </h2>

            <ul className="mt-6 flex flex-col gap-3">
              {terms.map((term, i) => (
                <li key={term}>
                  <label className="flex cursor-pointer items-start gap-3 text-lg leading-snug">
                    <input
                      type="checkbox"
                      checked={checked[i]}
                      onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                      className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span>{term}</span>
                  </label>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-foreground italic">These terms are completely legally useless.</p>
            <p aria-live="polite" className="min-h-7 font-hand text-lg text-accent">
              {anyUnchecked ? 'unchecking doesn\u2019t do anything btw \u{1F62D}' : ''}
            </p>

            <button
              type="button"
              onClick={onAccept}
              autoFocus
              className={cn(
                'gate-btn mt-2 w-full rounded-full border border-foreground/70 px-7 py-3 font-serif text-lg italic',
                accepted ? 'border-accent bg-accent text-card' : 'bg-foreground text-card',
              )}
            >
              {accepted ? 'good decision.' : 'I ACCEPT \u2764\uFE0F'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
