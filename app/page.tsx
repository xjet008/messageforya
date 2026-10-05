import { Experience } from '@/components/experience'
import { Hero } from '@/components/hero'
import { LoveMessage } from '@/components/love-message'
import { OneMoreTime } from '@/components/one-more-time'
import { SorryTable } from '@/components/sorry-table'

export default function Page() {
  return (
    <Experience>
      <Hero />
      <SorryTable />
      <LoveMessage />
      <OneMoreTime />
    </Experience>
  )
}
