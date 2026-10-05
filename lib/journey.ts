export const TOTAL_CARDS = 50

// Card notes evolve from goofy (1–10) → cute (11–25) → emotional (26–40) → sincere (41–50).
// Every one of the original handwritten notes is still in here (1–22).
export const progressiveNotes: string[] = [
  'open me, please',
  'yes, I\u2019m guilty \u{1F62D}',
  'with puppy eyes',
  'please don\u2019t throw tomatoes',
  'no take-backs',
  'okay, I deserve this one',
  'pronounced with a pout',
  'please hear me out',
  'I practiced this one',
  'with a tiny bow',
  'okay\u2026 seriously though \u{1F97A}',
  'I looked this one up twice',
  'you matter to me',
  'said very softly',
  'one sorry wasn\u2019t enough',
  'hand-delivered',
  'I hope you know that',
  'say it back? (optional)',
  'still thinking about you',
  'sealed with a kiss',
  'I really don\u2019t want you upset',
  'this one is extra sincere',
  'softer this time',
  'thinking of your smile',
  'I miss your laugh',
  'I really mean it.',
  'I\u2019d say it a thousand times.',
  'You mean more to me than this little website can say.',
  'If I could rewind that moment, I would.',
  'I hope you know how much you mean to me.',
  'I never want to hurt you.',
  'you\u2019re my favourite person.',
  'I\u2019m listening, always.',
  'I\u2019ll do better. Promise.',
  'every word of this is true.',
  'you deserve gentleness.',
  'I\u2019m grateful for you.',
  'this one\u2019s from the heart.',
  'I think about us a lot.',
  'no more jokes after this.',
  'No joke this time.',
  'I really am sorry.',
  'You are special to me.',
  'Thank you for being you.',
  'I mean every word.',
  'You make my days better.',
  'I\u2019m glad it\u2019s you.',
  'I\u2019m right here.',
  'Almost there. I mean it.',
  'I love you. \u2764\uFE0F',
]

const goofyQuips = [
  'with puppy eyes \u{1F97A}',
  'please don\u2019t be mad',
  'no take-backs',
  'okay I\u2019m guilty',
  'look, another one \u{1F62D}',
  'this one counts too',
  'still sorry btw',
  'don\u2019t skip me',
  'yes, I know',
  'I\u2019m trying here \u{1F62D}',
]

const softQuips = ['still sorry btw', 'this one counts too', 'yes, I know', 'read me slowly', 'this one\u2019s real']
const sincereQuips = ['read this one slowly', 'this one\u2019s real', 'no jokes here']

export function quipsFor(id: number) {
  if (id > 40) return sincereQuips
  if (id > 25) return softQuips
  return goofyQuips
}

export function postcardNote(id: number) {
  if (id <= 10) return 'one more sorry for you \u{1F62D}'
  if (id <= 25) return 'okay\u2026 this one is actually serious.'
  if (id <= 40) return 'no jokes anymore.'
  return 'I really mean this.'
}

export const milestones: Record<number, string> = {
  10: '10 already? \u{1F440}',
  25: 'halfway there\u2026',
  40: 'you\u2019re actually reading these \u{1F62D}',
  49: 'one more.',
  50: 'okay\u2026 I think she gets the message now. \u2764\uFE0F',
}

export const HEART_GAME_AT = 12
export const FORGIVE_PROMPT_AT = 6

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let audioCtx: AudioContext | null = null

export function playPaperSound() {
  if (typeof window === 'undefined') return
  try {
    audioCtx ??= new AudioContext()
    const ctx = audioCtx
    const duration = 0.28
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      data[i] = (Math.random() * 2 - 1) * (1 - t) * (0.6 + 0.4 * Math.sin(t * 40))
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200
    filter.Q.value = 0.7
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
  } catch {
    // Audio is a nice-to-have; ignore unsupported environments.
  }
}
