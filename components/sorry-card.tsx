'use client'

import { useState } from 'react'
import { Flower2, Heart, Sparkle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scriptClass, type Sorry } from '@/lib/sorries'
import { progressiveNotes, quipsFor } from '@/lib/journey'

const tilts = [-2, 1.5, -1, 2.5, -2.5, 1, -1.5, 3, -3, 2]
const sizes = ['min-h-44', 'min-h-52', 'min-h-48', 'min-h-56', 'min-h-44', 'min-h-48', 'min-h-52']
const offsets = ['', 'md:mt-6', '', 'md:-mt-3', 'md:mt-10', '', 'md:mt-3']
const ornaments = [Heart, Flower2, Sparkle, Heart, Star, Flower2]

type Props = {
  sorry: Sorry
  index: number
  onOpen: (sorry: Sorry) => void
  discovered?: boolean
}

export function SorryCard({ sorry, index, onOpen, discovered = false }: Props) {
  const [quip, setQuip] = useState('')
  const tilt = tilts[index % tilts.length]
  const jitter = (((index * 37) % 7) - 3) * 0.45
  const number = String(sorry.id).padStart(2, '0')
  const isTape = index % 5 === 2
  const isStamp = index % 7 === 4
  const Ornament = ornaments[index % ornaments.length]

  const pickQuip = () => {
    const list = quipsFor(sorry.id)
    setQuip(list[Math.floor(Math.random() * list.length)])
  }

  return (
    <li className={cn('list-none', offsets[index % offsets.length])}>
      <button
        type="button"
        onClick={() => onOpen(sorry)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && pickQuip()}
        onFocus={pickQuip}
        aria-haspopup="dialog"
        aria-label={`Note ${number}: ${sorry.language} \u2014 ${sorry.phrase}. ${discovered ? 'Already read. ' : ''}Open note.`}
        data-read={discovered}
        className={cn(
          'love-note paper-card group relative flex w-full flex-col justify-between rounded-sm border border-border p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-3 md:p-5',
          sizes[index % sizes.length],
          discovered && 'border-foreground/45',
        )}
        style={{ '--tilt': `${tilt}deg`, '--jitter': `${jitter}deg` } as React.CSSProperties}
      >
        <span aria-hidden="true" className="hover-quip font-hand">
          <Heart className="size-3 fill-accent text-accent" />
          {quip}
        </span>

        {isTape && (
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] bg-accent-soft/70 shadow-sm"
          />
        )}

        {discovered && (
          <span
            aria-hidden="true"
            className="read-stamp absolute -right-2.5 -bottom-2.5 z-10 flex size-9 rotate-12 items-center justify-center rounded-full border border-dashed border-accent bg-card text-accent shadow-sm"
          >
            <Heart className="size-3.5 fill-accent" />
          </span>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 rounded-[1px] border border-dashed border-foreground/15"
        />

        <span className="relative flex items-start justify-between gap-2">
          <span className="flex items-baseline gap-2">
            <span className="font-serif text-sm tracking-widest text-muted-foreground tabular-nums">No.{number}</span>
            {discovered && (
              <span aria-hidden="true" className="-rotate-6 font-hand text-sm text-accent">
                {'read \u2713'}
              </span>
            )}
          </span>
          {isStamp ? (
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center border border-dotted border-accent/60 text-accent"
            >
              <Heart className="size-3.5 fill-accent/80" />
            </span>
          ) : (
            <Ornament aria-hidden="true" className="size-3.5 shrink-0 text-accent/70" strokeWidth={1.5} />
          )}
        </span>

        <span className="relative my-4 flex flex-1 items-center">
          <span
            lang={sorry.lang}
            dir={sorry.dir}
            className={cn(
              'block w-full text-[1.05rem] leading-tight break-words text-foreground sm:text-xl md:text-[1.7rem]',
              scriptClass[sorry.script],
              sorry.script === 'latin' || sorry.script === 'cyrillic' ? 'italic' : '',
              sorry.dir === 'rtl' ? 'text-right' : 'text-left',
            )}
          >
            {sorry.phrase}
          </span>
        </span>

        <span className="relative flex items-end justify-between gap-2 border-t border-dashed border-foreground/20 pt-2">
          <span className="min-w-0 truncate text-[0.58rem] tracking-[0.08em] text-foreground/80 uppercase sm:text-xs sm:tracking-[0.14em] md:text-sm">{sorry.language}</span>
          <Heart aria-hidden="true" className="peek-heart size-4 shrink-0 fill-accent text-accent" />
        </span>

        <span aria-hidden="true" className="relative mt-1 line-clamp-2 font-hand text-[0.72rem] leading-tight text-accent/80 sm:text-sm md:text-base">
          {progressiveNotes[index] ?? progressiveNotes[index % progressiveNotes.length]}
        </span>
      </button>
    </li>
  )
}
