import { Heart } from 'lucide-react'
import { HeroButton } from './hero-button'

export function Hero() {
  return (
    <header className="fade-when-quiet relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-14 text-center md:pt-28 md:pb-20">
      <p className="font-hand text-xl text-accent md:text-2xl" style={{ transform: 'rotate(-3deg)' }}>
        a little letter, just for you
      </p>

      <h1 className="mt-4 font-serif text-7xl leading-none font-medium tracking-tight text-balance italic sm:text-8xl md:text-[10rem]">
        {"I'm Sorry"}
      </h1>

      <div className="mt-8 flex items-center gap-4" aria-hidden="true">
        <span className="h-px w-16 border-t border-dashed border-foreground/40" />
        <Heart className="size-4 fill-accent text-accent heartbeat" />
        <span className="h-px w-16 border-t border-dashed border-foreground/40" />
      </div>

      <p className="mt-8 font-serif text-3xl italic md:text-4xl">
        You are special to me. <span aria-label="heart">❤️</span>
      </p>

      <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
        {'Maybe one \u201Csorry\u201D isn\u2019t enough\u2026 so I said it in 50 languages.'}
      </p>

      <HeroButton />

      <p className="mt-10 flex items-center gap-2 font-hand text-2xl text-foreground/80">
        <span aria-hidden="true">{'\u2193'}</span>
        Click a card.
        <span aria-hidden="true">{'\u2193'}</span>
      </p>
    </header>
  )
}
