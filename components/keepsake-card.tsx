'use client'

import { useRef, useState } from 'react'
import { Download, Heart } from 'lucide-react'
import { renderKeepsake } from '@/lib/keepsake-canvas'

const SHARE_TEXT = 'A little effort, a whole lot of us. \u2764\uFE0F'
const FILE_NAME = 'together-us.png'

const floaters = [
  { top: '8%', left: '-4%', size: 14, delay: '0s' },
  { top: '40%', left: '102%', size: 12, delay: '1.2s' },
  { top: '78%', left: '-6%', size: 16, delay: '2.1s' },
  { top: '-4%', left: '70%', size: 10, delay: '0.7s' },
  { top: '92%', left: '88%', size: 12, delay: '1.7s' },
]

const delay = (s: string) => ({ '--d': s }) as React.CSSProperties

export function KeepsakeCard() {
  const [kept, setKept] = useState(false)
  const [status, setStatus] = useState('')
  const [proof, setProof] = useState(0)
  const [busy, setBusy] = useState(false)
  const blobRef = useRef<Promise<Blob> | null>(null)

  const getBlob = () => {
    blobRef.current ??= renderKeepsake().catch((err) => {
      blobRef.current = null
      throw err
    })
    return blobRef.current
  }

  const keep = () => {
    setKept(true)
    void getBlob().catch(() => {})
  }

  const celebrate = () => {
    if (proof) return
    setProof(1)
    window.setTimeout(() => setProof(2), 1800)
    window.setTimeout(() => setProof(3), 3400)
  }

  const download = async () => {
    setBusy(true)
    try {
      const blob = await getBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = FILE_NAME
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 4000)
      setStatus('saved to your device.')
      celebrate()
    } catch {
      setStatus('hmm, the card couldn\u2019t be saved on this device.')
    } finally {
      setBusy(false)
    }
  }

  const shareLinkOnWhatsApp = (note: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${window.location.href}`)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus(note)
    celebrate()
  }

  const share = async () => {
    setBusy(true)
    try {
      const blob = await getBlob()
      const file = new File([blob], FILE_NAME, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: SHARE_TEXT })
        setStatus('card attached \u2014 pick WhatsApp in the share sheet \u{1F49A}')
        celebrate()
        return
      }
      shareLinkOnWhatsApp('this device can\u2019t attach the picture, so I sent the link instead. (download it to send the card itself.)')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus('')
        return
      }
      shareLinkOnWhatsApp('couldn\u2019t attach the picture here, so I sent the link instead.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xl">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {floaters.map((f, i) => (
            <Heart
              key={i}
              className="drift-heart absolute fill-accent/50 text-accent/50"
              width={f.size}
              height={f.size}
              style={{ top: f.top, left: f.left, animationDelay: f.delay }}
            />
          ))}
        </div>

        <article
          aria-label="Our together keepsake card"
          className="keepsake-in paper-card keepsake-shadow relative grid aspect-[4/5] w-full rounded-sm border border-foreground/30 p-2.5 text-left sm:p-3"
        >
          <div className="relative flex flex-col border border-dashed border-foreground/25 px-6 pt-8 pb-6 sm:px-10 sm:pt-12 sm:pb-9">
            <Heart aria-hidden="true" className="absolute top-3 left-3 size-3 -rotate-12 fill-accent-soft text-accent-soft" />
            <Heart aria-hidden="true" className="absolute right-3 bottom-3 size-3.5 rotate-12 fill-accent-soft text-accent-soft" />

            <div className="absolute top-6 right-5 flex size-16 rotate-[4deg] flex-col items-center justify-center border-2 border-dotted border-accent/70 bg-accent-soft/25 text-accent sm:top-9 sm:right-8 sm:size-20">
              <Heart aria-hidden="true" className="size-6 fill-accent sm:size-7" />
              <span className="mt-1 text-[0.5rem] tracking-[0.2em] uppercase sm:text-[0.6rem]">Par avion</span>
            </div>
            <div
              aria-hidden="true"
              className="absolute top-10 right-20 flex size-14 -rotate-12 flex-col items-center justify-center rounded-full border border-foreground/30 text-[0.45rem] tracking-[0.2em] text-foreground/40 uppercase sm:top-14 sm:right-28 sm:size-[4.5rem] sm:text-[0.5rem]"
            >
              <span>with love</span>
              <span>{'\u00B7 2026 \u00B7'}</span>
            </div>

            <p className="ink-reveal pr-28 text-[0.65rem] tracking-[0.35em] text-accent uppercase sm:text-sm" style={delay('0.9s')}>
              {'Made whole, together \u2764\uFE0F'}
            </p>
            <span aria-hidden="true" className="mt-3 block h-px w-24 border-t border-foreground/25" />

            <div className="mt-auto flex flex-col">
              <p className="slow-line font-serif text-4xl leading-none italic sm:text-6xl" style={delay('1.8s')}>
                {'I\u2019ll keep choosing us.'}
              </p>
              <p className="slow-line mt-5 font-serif text-xl leading-snug sm:mt-8 sm:text-3xl" style={delay('2.8s')}>
                {'Your effort and mine. \u2764\uFE0F'}
                <br />
                <em>Together, we make us whole.</em>
              </p>
              <span aria-hidden="true" className="slow-line my-4 block border-t border-dashed border-foreground/25 sm:my-6" style={delay('3.6s')} />
              <p className="slow-line text-sm leading-relaxed text-pretty text-muted-foreground sm:text-lg" style={delay('3.8s')}>
                {'I\u2019m sorry. I\u2019ll keep listening, showing up, and putting in the effort. You matter to me.'}
              </p>
              <p className="slow-line mt-3 -rotate-2 font-hand text-2xl text-accent sm:mt-5 sm:text-4xl" style={delay('4.8s')}>
                Thank you for being here.
              </p>
            </div>

            <div className="mt-auto flex items-end justify-between gap-4 pt-4">
              <div className="flex flex-col gap-2.5" aria-hidden="true">
                <span className="text-[0.5rem] tracking-[0.25em] text-muted-foreground uppercase sm:text-[0.6rem]">To: my favourite person</span>
                <span className="block h-px w-24 border-t border-foreground/25 sm:w-40" />
                <span className="block h-px w-24 border-t border-foreground/25 sm:w-40" />
              </div>
              <p className="slow-line shrink-0 -rotate-3 border-b border-foreground/25 pb-1 font-hand text-2xl whitespace-nowrap sm:text-5xl" style={delay('5.8s')}>
                {'\u2014 yours \u2764\uFE0F'}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="slow-line mt-14 flex flex-col items-center gap-4" style={delay('6.6s')}>
        {!kept ? (
          <button
            type="button"
            onClick={keep}
            className="min-h-12 -rotate-2 rounded-full border border-dashed border-accent/60 px-6 font-hand text-2xl text-accent transition-colors hover:bg-accent-soft/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {'keep this \u2764\uFE0F'}
          </button>
        ) : (
          <>
            <p className="rise-in -rotate-1 font-hand text-2xl text-foreground/80">{'this one\u2019s yours.'}</p>
            <div className="rise-in flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={download}
                disabled={busy}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/70 bg-foreground px-6 text-sm tracking-[0.2em] text-card uppercase transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-60"
              >
                <Download aria-hidden="true" className="size-4" />
                Download card
              </button>
              <button
                type="button"
                onClick={share}
                disabled={busy}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/70 px-6 text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60"
              >
                {'Share on WhatsApp \u{1F49A}'}
              </button>
            </div>
          </>
        )}

        <p aria-live="polite" className="min-h-6 max-w-sm text-sm text-muted-foreground italic">
          {status}
        </p>

        <div aria-live="polite" className="flex min-h-36 flex-col items-center gap-1">
          {proof >= 1 && <p className="slow-rise font-hand text-2xl text-accent">{'okay, now you officially have proof. \u{1F62D}\u2764\uFE0F'}</p>}
          {proof >= 2 && <p className="slow-rise mt-4 font-serif text-2xl italic">no more apologies.</p>}
          {proof >= 3 && (
            <>
              <p className="slow-rise font-serif text-3xl">just love.</p>
              <Heart aria-hidden="true" className="slow-rise heartbeat mt-4 size-5 fill-accent text-accent" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
