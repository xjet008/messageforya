'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'

const spots = [
  { top: '16%', left: '12%', rot: '-12deg' },
  { top: '72%', left: '18%', rot: '10deg' },
  { top: '24%', left: '80%', rot: '8deg' },
]

type Props = {
  open: boolean
  onDone: () => void
}

export function HeartGame({ open, onDone }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [caught, setCaught] = useState<boolean[]>([false, false, false])
  const [ready, setReady] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      const t = window.setTimeout(() => setReady(true), 800)
      return () => clearTimeout(t)
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const count = caught.filter(Boolean).length
  const done = count === 3

  const catchHeart = (i: number) => {
    if (caught[i]) return
    setCaught((c) => c.map((v, j) => (j === i ? true : v)))
    setFeedback(count + 1 === 3 ? 'okay wow, you actually did it.' : `\u2764\uFE0F got one (${count + 1}/3)`)
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="game-title"
      className="game-dialog paper fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden p-0"
      onCancel={(e) => {
        e.preventDefault()
        onDone()
      }}
    >
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 id="game-title" className="rise-in font-serif text-7xl italic md:text-8xl">
          WAIT.
        </h2>
        {ready && (
          <p className="rise-in mt-4 font-serif text-2xl md:text-3xl">{'Catch 3 hearts to continue \u2764\uFE0F'}</p>
        )}

        <p aria-live="polite" className="mt-6 min-h-9 font-hand text-2xl text-accent md:text-3xl">
          {feedback}
        </p>

        <div className="mt-4 min-h-14">
          {done ? (
            <button
              type="button"
              autoFocus
              onClick={onDone}
              className="rise-in rounded-full border border-foreground/70 px-8 py-3 font-serif text-xl italic transition-colors hover:border-accent hover:bg-accent hover:text-card focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {'continue \u2192'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onDone}
              className="text-sm tracking-[0.2em] text-muted-foreground uppercase underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              skip (rude)
            </button>
          )}
        </div>

        {ready &&
          spots.map((spot, i) => (
            <button
              key={i}
              type="button"
              onClick={() => catchHeart(i)}
              disabled={caught[i]}
              aria-label={caught[i] ? `Heart ${i + 1} caught` : `Catch heart ${i + 1}`}
              className="catch-heart absolute flex size-16 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              data-caught={caught[i]}
              style={{ top: spot.top, left: spot.left, '--rot': spot.rot, animationDelay: `${i * 0.4}s` } as React.CSSProperties}
            >
              <Heart aria-hidden="true" className="size-8 fill-accent text-accent drop-shadow-sm" />
            </button>
          ))}
      </div>
    </dialog>
  )
}
