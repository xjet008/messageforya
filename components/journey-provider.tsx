'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { playPaperSound } from '@/lib/journey'

type Mood = 'playful' | 'quiet' | 'soft'

type Journey = {
  entered: boolean
  enter: () => void
  discovered: ReadonlySet<number>
  discover: (id: number) => number
  mood: Mood
  setMood: (mood: Mood) => void
  calm: boolean
  setCalm: (calm: boolean) => void
  soundOn: boolean
  toggleSound: () => void
  paperSound: () => void
}

const JourneyContext = createContext<Journey | null>(null)

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)
  const [discovered, setDiscovered] = useState<Set<number>>(() => new Set())
  const [mood, setMood] = useState<Mood>('playful')
  const [calm, setCalm] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  const discover = useCallback(
    (id: number) => {
      let size = discovered.size
      if (!discovered.has(id)) {
        const next = new Set(discovered)
        next.add(id)
        size = next.size
        setDiscovered(next)
      }
      return size
    },
    [discovered],
  )

  useEffect(() => {
    const root = document.documentElement
    root.dataset.mood = mood
    if (calm) root.dataset.calm = 'true'
    else delete root.dataset.calm
  }, [mood, calm])

  const paperSound = useCallback(() => {
    if (soundOn) playPaperSound()
  }, [soundOn])

  const value = useMemo<Journey>(
    () => ({
      entered,
      enter: () => setEntered(true),
      discovered,
      discover,
      mood,
      setMood,
      calm,
      setCalm,
      soundOn,
      toggleSound: () => setSoundOn((s) => !s),
      paperSound,
    }),
    [entered, discovered, discover, mood, calm, soundOn, paperSound],
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider')
  return ctx
}
