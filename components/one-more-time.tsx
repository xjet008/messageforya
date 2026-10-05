'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/journey'
import { useJourney } from './journey-provider'
import { TogetherCard } from './together-card'

const hearts = [
  { left: '8%', drift: '-20px', delay: '0s', dur: '6s', size: 14 },
  { left: '20%', drift: '25px', delay: '1.1s', dur: '5.4s', size: 10 },
  { left: '34%', drift: '-10px', delay: '0.5s', dur: '6.6s', size: 18 },
  { left: '50%', drift: '15px', delay: '1.6s', dur: '5.8s', size: 12 },
  { left: '64%', drift: '-25px', delay: '0.2s', dur: '6.4s', size: 16 },
  { left: '78%', drift: '20px', delay: '1.3s', dur: '5.6s', size: 11 },
  { left: '90%', drift: '-15px', delay: '0.8s', dur: '6.2s', size: 14 },
]

const burst = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2
  return { bx: `${Math.cos(angle) * 46}px`, by: `${Math.sin(angle) * 46}px` }
})

const Line = ({ step, children, className = '' }: { step: number; children: React.ReactNode; className?: string }) => (
  <p data-step={step} className={`slow-rise scroll-my-40 ${className}`}>
    {children}
  </p>
)

export function OneMoreTime() {
  const { setMood } = useJourney()
  const [step, setStep] = useState(0)
  const [thinking, setThinking] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (step === 0) return
    const el = sectionRef.current?.querySelector(`[data-step="${step}"]`)
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: step === 13 ? 'start' : 'nearest' })
  }, [step])

  const schedule = (plan: [number, number][]) => {
    plan.forEach(([ms, s]) => timers.current.push(window.setTimeout(() => setStep(s), ms)))
  }

  const begin = () => {
    setMood('quiet')
    setStep(1)
    schedule([
      [1500, 2],
      [3000, 3],
      [4600, 4],
      [6800, 5],
      [9800, 6],
    ])
  }

  const comeHere = () => {
    setStep(7)
    schedule([
      [1700, 8],
      [5000, 9],
    ])
  }

  const think = () => {
    setThinking(1)
    timers.current.push(window.setTimeout(() => setThinking(2), 1200))
  }

  const sayYes = () => {
    setStep(11)
    schedule([
      [1600, 12],
      [3400, 13],
    ])
    timers.current.push(window.setTimeout(() => setMood('soft'), 3000))
  }

  return (
    <section ref={sectionRef} aria-label="One more time" className="mx-auto max-w-3xl px-6 pb-32 text-center md:pb-44">
      {step === 0 ? (
        <div className="group relative inline-flex flex-col items-center">
          <span
            aria-hidden="true"
            className="pointer-events-none mb-2 -rotate-3 font-hand text-2xl text-accent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            {'you sure? \u{1F440}'}
          </span>
          <button
            type="button"
            onClick={begin}
            className="group/btn inline-flex items-center gap-3 rounded-full border border-foreground/70 px-8 py-3 font-serif text-xl italic transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-card focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            One more time
            <Heart
              aria-hidden="true"
              className="size-4 fill-accent text-accent transition-colors group-hover/btn:fill-card group-hover/btn:text-card"
            />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 pt-10" role="status" aria-live="polite">
          <Line step={1} className="font-hand text-3xl text-foreground/70">{'okay\u2026'}</Line>
          {step >= 2 && <Line step={2} className="font-serif text-3xl italic md:text-4xl">no more games.</Line>}
          {step >= 3 && (
            <Line step={3} className="mt-6 font-serif text-5xl leading-tight md:text-6xl">
              {'I\u2019m actually sorry.'}
            </Line>
          )}

          {step >= 4 && (
            <div data-step={4} className="relative mt-16 w-full scroll-my-24">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-64">
                {hearts.map((h, i) => (
                  <Heart
                    key={i}
                    className="float-heart absolute bottom-0 fill-accent/60 text-accent/60"
                    width={h.size}
                    height={h.size}
                    style={
                      {
                        left: h.left,
                        '--drift': h.drift,
                        '--delay': h.delay,
                        '--dur': h.dur,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>

              <div className="rise-in paper-card relative mx-auto max-w-lg -rotate-1 rounded-sm border border-border p-3 shadow-xl">
                <div className="border border-dashed border-foreground/25 px-6 py-12 md:px-12">
                  <Heart aria-hidden="true" className="heartbeat mx-auto size-8 fill-accent text-accent" />
                  <p className="mt-6 font-serif text-3xl leading-snug md:text-4xl">
                    {"I'm sorry "}
                    <span aria-label="heart">❤️</span>
                    <br />
                    I love you.
                    <br />
                    <em>{'And yes\u2026 you really are special to me.'}</em>
                  </p>
                  <p className="mt-8 rotate-2 font-hand text-2xl text-accent">{'\u2014 always, me'}</p>
                </div>
              </div>
            </div>
          )}

          {step >= 5 && (
            <Line step={5} className="mt-16 max-w-xl font-serif text-2xl leading-relaxed text-pretty text-foreground/85 italic md:text-3xl">
              {'I could say sorry in 50 languages, but I\u2019d still mean the same thing in every one of them.'}
            </Line>
          )}

          {step === 6 && (
            <button
              type="button"
              data-step={6}
              onClick={comeHere}
              className="slow-rise mt-10 min-h-12 -rotate-2 rounded-full border border-dashed border-accent/60 px-6 font-hand text-2xl text-accent transition-colors hover:bg-accent-soft/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              {'come here \u{1FAF6}'}
            </button>
          )}

          {step >= 7 && (
            <div className="relative mt-10 flex flex-col items-center gap-2">
              <span aria-hidden="true" className="relative block size-6">
                <Heart className="absolute inset-0 size-6 fill-accent text-accent" />
                {burst.map((b, i) => (
                  <Heart
                    key={i}
                    className="burst-heart absolute top-1.5 left-1.5 size-3 fill-accent/70 text-accent/70"
                    style={{ '--bx': b.bx, '--by': b.by } as React.CSSProperties}
                  />
                ))}
              </span>
              <Line step={7} className="mt-4 font-hand text-3xl text-foreground/80">
                {'okay, now I\u2019m done bothering you.'}
              </Line>
              {step >= 8 && (
                <Line step={8} className="font-hand text-3xl text-accent">
                  {'probably. \u{1F62D}\u2764\uFE0F'}
                </Line>
              )}
            </div>
          )}

          {step === 9 && (
            <button
              type="button"
              data-step={9}
              onClick={() => setStep(10)}
              className="slow-rise mt-14 min-h-12 px-4 font-serif text-2xl italic underline decoration-accent/50 decoration-dashed underline-offset-8 transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              {'one last thing\u2026'}
            </button>
          )}

          {step === 10 && (
            <div data-step={10} className="slow-rise mt-14 flex scroll-my-40 flex-col items-center gap-6">
              <p className="font-serif text-3xl italic md:text-4xl">{'okay\u2026 but I need you to choose.'}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={sayYes}
                  className="min-h-12 rounded-full border border-accent bg-accent px-8 text-sm tracking-[0.2em] text-card uppercase transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  {'Yes \u2764\uFE0F'}
                </button>
                {thinking === 0 && (
                  <button
                    type="button"
                    onClick={think}
                    className="min-h-12 rounded-full border border-foreground/70 px-8 text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    {'Let me think \u{1F440}'}
                  </button>
                )}
              </div>
              <div className="min-h-16 font-hand text-2xl text-foreground/75">
                {thinking >= 1 && <p className="slow-rise">{'fair enough \u{1F62D}'}</p>}
                {thinking >= 2 && <p className="slow-rise">{'I\u2019ll wait.'}</p>}
              </div>
            </div>
          )}

          {step >= 11 && (
            <div className="mt-14 flex flex-col items-center gap-3">
              <Heart aria-hidden="true" className="yes-heart size-10 fill-accent text-accent" />
              <Line step={11} className="mt-4 font-hand text-3xl text-foreground/70">{'okay\u2026'}</Line>
              {step >= 12 && (
                <Line step={12} className="font-serif text-4xl italic md:text-5xl">
                  {'thank you for hearing me. \u2764\uFE0F'}
                </Line>
              )}
            </div>
          )}

          {step >= 13 && (
            <div data-step={13} className="mt-20 w-full scroll-mt-10">
              <TogetherCard />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
