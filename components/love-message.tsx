'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/journey'

export function LoveMessage() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setVisible(true)
        if (prefersReducedMotion()) {
          setCount(50)
          return
        }
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setCount(Math.round(50 * (1 - Math.pow(1 - t, 3))))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="one-message"
      aria-label="One message"
      data-visible={visible}
      className="fade-when-quiet seq-reveal mx-auto max-w-4xl scroll-mt-10 px-6 py-28 text-center md:py-40"
    >
      <span aria-hidden="true" className="mx-auto mb-12 block h-16 w-px border-l border-dashed border-foreground/30" />
      <p className="seq mb-12 text-sm tracking-[0.35em] text-muted-foreground uppercase tabular-nums" style={{ '--d': '0s' } as React.CSSProperties}>
        <span aria-hidden="true">{count}</span>
        <span className="sr-only">50</span> / 50
      </p>
      <p className="seq font-serif text-6xl leading-none italic sm:text-7xl md:text-9xl" style={{ '--d': '1.5s' } as React.CSSProperties}>
        50 languages.
      </p>
      <p
        className="seq mt-6 font-serif text-5xl leading-none text-muted-foreground sm:text-6xl md:mt-10 md:text-8xl"
        style={{ '--d': '2.7s' } as React.CSSProperties}
      >
        One message.
      </p>
      <p className="seq mt-10 -rotate-2 font-hand text-3xl text-accent md:text-4xl" style={{ '--d': '4s' } as React.CSSProperties}>
        Still not enough ways to say it.
      </p>
      <p className="seq mx-auto mt-20 max-w-xl font-serif text-3xl leading-snug md:mt-28 md:text-4xl" style={{ '--d': '5s' } as React.CSSProperties}>
        {"I'm sorry."}
        <br />
        I love you.
        <br />
        <em>
          You are special to me. <span aria-label="heart">❤️</span>
        </em>
      </p>
    </section>
  )
}
