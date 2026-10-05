'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { Heart } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/journey'
import { useJourney } from './journey-provider'
import { KeepsakeCard } from './keepsake-card'

type Side = 'mine' | 'yours'
type Point = { x: number; y: number }
const START: Record<Side, Point> = { mine: { x: -11, y: 4 }, yours: { x: 11, y: -3 } }
const SEAM = 'L188 98 L210 145 L189 190 L208 237 L190 283 L210 330 L190 375 L207 419 L200 460'
const LEFT = `M50 40 H200 ${SEAM} H50 Z`
const RIGHT = `M200 40 H350 V460 H200 L207 419 L190 375 L210 330 L190 283 L208 237 L189 190 L210 145 L188 98 Z`
const HEART = 'M200 292 C180 272 105 225 105 190 C105 143 165 134 200 176 C235 134 295 143 295 190 C295 225 220 272 200 292 Z'

function PaperHalf({ side, id }: { side: Side; id: string }) {
  return (
    <svg viewBox="0 0 400 500" aria-hidden="true" className="together-art">
      <defs>
        <clipPath id={id}><path d={side === 'mine' ? LEFT : RIGHT} /></clipPath>
        <pattern id={`${id}-paper`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="3" r="0.5" fill="currentColor" opacity="0.08" />
          <circle cx="5" cy="1" r="0.4" fill="currentColor" opacity="0.06" />
        </pattern>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="50" y="40" width="300" height="420" rx="2" fill="var(--card)" />
        <rect x="50" y="40" width="300" height="420" fill={`url(#${id}-paper)`} />
        <rect x="61" y="51" width="278" height="398" fill="none" stroke="var(--foreground)" strokeOpacity="0.25" />
        <rect x="70" y="60" width="260" height="380" fill="none" stroke="var(--foreground)" strokeOpacity="0.22" strokeDasharray="3 4" />
        <text x="200" y="105" textAnchor="middle" className="together-art-hand" fontSize="24" fill="var(--accent)">a little piece of us</text>
        <path d={HEART} fill="var(--accent)" />
        <path d={HEART} fill="none" stroke="var(--card)" strokeOpacity="0.35" strokeWidth="2" transform="translate(12 13) scale(.94)" />
        <text x="126" y="355" textAnchor="middle" className="together-art-hand" fontSize="25">my effort</text>
        <text x="274" y="355" textAnchor="middle" className="together-art-hand" fontSize="25">your effort</text>
        <text x="126" y="384" textAnchor="middle" className="together-art-serif" fontSize="15" fill="var(--muted-foreground)">I’m here.</text>
        <text x="274" y="384" textAnchor="middle" className="together-art-serif" fontSize="15" fill="var(--muted-foreground)">You’re here.</text>
      </g>
      <path d={side === 'mine' ? LEFT : RIGHT} fill="none" stroke="var(--foreground)" strokeOpacity="0.28" strokeWidth="1.5" />
    </svg>
  )
}

export function TogetherCard() {
  const id = useId().replace(/:/g, '')
  const { paperSound } = useJourney()
  const [positions, setPositions] = useState(START)
  const positionsRef = useRef(START)
  const [placed, setPlaced] = useState<Record<Side, boolean>>({ mine: false, yours: false })
  const [dragging, setDragging] = useState<Side | null>(null)
  const [hint, setHint] = useState('Two pieces. A little effort from both of us.')
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const letter = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const active = useRef<{ side: Side; pointer: number; start: Point; origin: Point; width: number; height: number } | null>(null)
  const joined = placed.mine && placed.yours

  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (!opened) return
    letter.current?.focus({ preventScroll: true })
    letter.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [opened])

  const move = (side: Side, point: Point) => {
    positionsRef.current = { ...positionsRef.current, [side]: point }
    setPositions(positionsRef.current)
  }

  const place = (side: Side) => {
    if (placed[side]) return
    move(side, { x: 0, y: 0 })
    setPlaced((previous) => ({ ...previous, [side]: true }))
    setHint(placed[side === 'mine' ? 'yours' : 'mine']
      ? 'Your effort and my effort make us whole.'
      : side === 'mine' ? 'My effort is here. There’s a place for yours, too.' : 'Your effort is here. Let’s bring mine beside it.')
    paperSound()
  }

  const startDrag = (event: PointerEvent<HTMLButtonElement>, side: Side) => {
    if (placed[side] || active.current || event.button !== 0) return
    const bounds = stage.current?.getBoundingClientRect()
    if (!bounds) return
    event.currentTarget.setPointerCapture(event.pointerId)
    active.current = { side, pointer: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: positionsRef.current[side], width: bounds.width, height: bounds.height }
    setDragging(side)
  }

  const drag = (event: PointerEvent<HTMLButtonElement>) => {
    const current = active.current
    if (!current || current.pointer !== event.pointerId) return
    move(current.side, {
      x: Math.max(-18, Math.min(18, current.origin.x + (event.clientX - current.start.x) / current.width * 100)),
      y: Math.max(-15, Math.min(15, current.origin.y + (event.clientY - current.start.y) / current.height * 100)),
    })
  }

  const finishDrag = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = active.current
    if (!current || current.pointer !== event.pointerId) return
    active.current = null
    setDragging(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    const point = positionsRef.current[current.side]
    const tapped = Math.hypot(event.clientX - current.start.x, event.clientY - current.start.y) < 5
    if (!cancelled && (tapped || Math.hypot(point.x, point.y) <= 7)) {
      place(current.side)
    } else {
      move(current.side, START[current.side])
      if (!cancelled) setHint('A little closer to the outline. Take your time.')
    }
  }

  const open = () => {
    if (!joined || opening) return
    setOpening(true)
    paperSound()
    timer.current = window.setTimeout(() => setOpened(true), prefersReducedMotion() ? 0 : 650)
  }

  if (opened) return (
    <div ref={letter} tabIndex={-1} aria-label="Our completed card" className="together-letter focus:outline-none">
      <p className="mb-8 -rotate-2 font-hand text-3xl text-accent">a little effort. a whole lot of us.</p>
      <KeepsakeCard />
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center" aria-label="Bring our two pieces together">
      <h2 className="font-serif text-3xl italic sm:text-4xl">One last thing, together.</h2>
      <p id={`${id}-instructions`} className="mt-3 max-w-sm text-base text-muted-foreground">
        Bring both pieces into the outline.<br />Drag them closer, or tap each piece.
      </p>
      <div ref={stage} className="together-stage" data-joined={joined} data-opening={opening}>
        <svg viewBox="0 0 400 500" aria-hidden="true" className="together-outline">
          <rect x="50" y="40" width="300" height="420" rx="2" fill="var(--accent-soft)" fillOpacity="0.12" stroke="var(--accent)" strokeOpacity="0.28" strokeDasharray="4 7" />
          <path d={HEART} fill="var(--accent-soft)" fillOpacity="0.3" />
        </svg>
        {(['mine', 'yours'] as const).map((side) => (
          <div key={side} className="together-piece-shadow" data-dragging={dragging === side}>
          <button type="button" className={`together-piece together-piece-${side}`}
            aria-label={`${placed[side] ? 'Placed' : 'Join'} ${side === 'mine' ? 'my' : 'your'} effort${placed[side] ? '' : ' with the other piece'}`}
            aria-pressed={placed[side]} aria-describedby={`${id}-instructions`} aria-disabled={placed[side]}
            data-placed={placed[side]} data-dragging={dragging === side}
            style={{ '--piece-x': `${positions[side].x}%`, '--piece-y': `${positions[side].y}%` } as CSSProperties}
            onPointerDown={(event) => startDrag(event, side)} onPointerMove={drag}
            onPointerUp={(event) => finishDrag(event)} onPointerCancel={(event) => finishDrag(event, true)}
            onLostPointerCapture={(event) => finishDrag(event, true)}
            onClick={(event) => { if (event.detail === 0) place(side) }}>
            <PaperHalf side={side} id={`${id}-${side}`} />
          </button>
          </div>
        ))}
        {joined && (
          <svg viewBox="0 0 400 500" aria-hidden="true" className="together-mend">
            <path d={`M200 40 ${SEAM}`} fill="none" stroke="var(--accent-soft)" strokeWidth="3" />
            {[115, 155, 200, 245, 290, 335, 380, 425].map((y) => <path key={y} d={`M190 ${y - 3} l20 6`} stroke="var(--accent)" strokeWidth="1.3" />)}
          </svg>
        )}
      </div>
      <div className="together-after flex min-h-40 w-full flex-col items-center gap-4">
        <p aria-live="polite" className={`max-w-sm text-balance ${joined ? 'font-hand text-3xl text-accent' : 'text-base text-muted-foreground italic'}`}>{hint}</p>
        {joined ? (
          <>
            <p className="rise-in max-w-sm text-base text-muted-foreground">Two people choosing each other, and keeping that choice alive with effort.</p>
            <button type="button" onClick={open} disabled={opening} className="rise-in inline-flex min-h-12 items-center gap-2 rounded-full border border-accent/60 px-6 font-hand text-2xl text-accent transition-colors hover:bg-accent-soft/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60">
              turn over our card <Heart aria-hidden="true" className="size-4 fill-accent" />
            </button>
          </>
        ) : <p className="font-hand text-xl text-accent" aria-hidden="true">{Number(placed.mine) + Number(placed.yours)} of 2 pieces, coming home.</p>}
      </div>
    </div>
  )
}
