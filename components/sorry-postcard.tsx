'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scriptClass, type Sorry } from '@/lib/sorries'
import { postcardNote } from '@/lib/journey'

type Props = {
  sorry: Sorry | null
  onClose: () => void
}

export function SorryPostcard({ sorry, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (sorry && !dialog.open) {
      setClosing(false)
      dialog.showModal()
    }
  }, [sorry])

  const isFinal = sorry?.id === 50

  const requestClose = () => {
    if (closing) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setClosing(true)
    window.setTimeout(
      () => {
        ref.current?.close()
        setClosing(false)
        onClose()
      },
      reduce ? 0 : isFinal ? 520 : 230,
    )
  }

  const number = sorry ? String(sorry.id).padStart(2, '0') : ''

  return (
    <dialog
      ref={ref}
      aria-labelledby="postcard-title"
      data-closing={closing}
      data-final={isFinal}
      className="postcard-dialog fixed inset-0 m-auto w-[min(92vw,40rem)]"
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      {sorry && !isFinal && (
        <div key={sorry.id} className="postcard-enter paper-card postcard-shadow relative rounded-sm border border-border p-3">
          <Heart aria-hidden="true" className="postcard-float-heart absolute top-6 right-10 size-4 fill-accent text-accent" />
          <div className="relative grid gap-6 border border-dashed border-foreground/25 p-6 md:grid-cols-[1fr_auto_11rem] md:p-8">
            <button
              type="button"
              onClick={requestClose}
              className="absolute top-2 right-2 rounded-full p-2 text-muted-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              aria-label="Close note"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col">
              <p className="text-[0.7rem] tracking-[0.3em] text-accent uppercase">Apology #{sorry.id}</p>
              <p className="mt-1 text-sm tracking-[0.2em] text-muted-foreground uppercase">
                No.{number} {'\u00B7'} {sorry.language}
              </p>

              <h2 id="postcard-title" className="mt-4">
                <span
                  lang={sorry.lang}
                  dir={sorry.dir}
                  className={cn(
                    'block text-5xl leading-tight break-words md:text-6xl',
                    scriptClass[sorry.script],
                    sorry.script === 'latin' || sorry.script === 'cyrillic' ? 'italic' : '',
                    sorry.dir === 'rtl' ? 'text-right' : '',
                  )}
                >
                  {sorry.phrase}
                </span>
                <span className="sr-only"> — {"I'm sorry"} in {sorry.language}</span>
              </h2>

              <p className="mt-6 font-serif text-2xl leading-snug md:text-3xl">
                I love you. <span aria-label="heart">❤️</span>
                <br />
                <em>You are special to me.</em>
              </p>

              <p className="mt-4 -rotate-1 font-hand text-xl text-foreground/70">{postcardNote(sorry.id)}</p>
            </div>

            <span aria-hidden="true" className="hidden w-px border-l border-dashed border-foreground/25 md:block" />

            <div className="flex flex-col justify-between gap-6 border-t border-dashed border-foreground/25 pt-6 md:border-t-0 md:pt-0">
              <div className="ml-auto flex size-20 rotate-3 flex-col items-center justify-center border-2 border-dotted border-accent/60 text-accent">
                <Heart aria-hidden="true" className="size-7 fill-accent heartbeat" />
                <span className="mt-1 text-[0.6rem] tracking-widest uppercase">Par avion</span>
              </div>

              <div className="flex flex-col gap-3" aria-hidden="true">
                <span className="h-px border-t border-foreground/25" />
                <span className="h-px border-t border-foreground/25" />
                <span className="h-px border-t border-foreground/25" />
              </div>

              <p className="-rotate-2 font-hand text-2xl leading-tight text-accent">
                {'No matter what language I say it in, I mean it.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {sorry && isFinal && (
        <div key="final" className="postcard-final paper-card postcard-shadow relative rounded-sm border border-border p-3">
          <div className="relative flex flex-col items-center border border-dashed border-foreground/25 px-6 py-16 text-center md:px-14 md:py-24">
            <button
              type="button"
              onClick={requestClose}
              className="absolute top-2 right-2 rounded-full p-2 text-muted-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              aria-label="Close note"
            >
              <X className="size-5" />
            </button>

            <div className="absolute top-5 left-5 flex size-14 -rotate-3 flex-col items-center justify-center border border-dotted border-accent/50 text-accent">
              <Heart aria-hidden="true" className="size-4 fill-accent/80" />
              <span className="mt-0.5 text-[0.45rem] tracking-widest uppercase">Par avion</span>
            </div>

            <p className="slow-line text-xs tracking-[0.35em] text-muted-foreground uppercase" style={{ '--d': '0.2s' } as React.CSSProperties}>
              Apology #50
            </p>

            <h2 id="postcard-title" className="slow-line mt-10 font-serif text-4xl italic md:text-5xl" style={{ '--d': '1s' } as React.CSSProperties}>
              No joke this time.
            </h2>

            <p className="slow-line mt-8 font-serif text-3xl md:text-4xl" style={{ '--d': '2.4s' } as React.CSSProperties}>
              {'I\u2019m actually sorry.'}
            </p>

            <p
              lang={sorry.lang}
              className="slow-line mt-3 font-serif text-lg text-muted-foreground italic"
              style={{ '--d': '2.8s' } as React.CSSProperties}
            >
              {sorry.phrase} {'\u00B7'} {sorry.language}
            </p>

            <span aria-hidden="true" className="slow-line mt-12 block h-10 w-px border-l border-dashed border-foreground/30" style={{ '--d': '3.6s' } as React.CSSProperties} />

            <p className="slow-line mt-12 font-serif text-2xl leading-snug md:text-3xl" style={{ '--d': '4.2s' } as React.CSSProperties}>
              I love you. <span aria-label="heart">❤️</span>
              <br />
              <em>You are special to me.</em>
            </p>
          </div>
        </div>
      )}
    </dialog>
  )
}
