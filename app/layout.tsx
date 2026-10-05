import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Caveat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'vietnamese'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const hand = Caveat({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-caveat',
  display: 'swap',
})

const scriptFonts = [
  'Noto+Serif:ital,wght@0,400;1,400',
  'Noto+Serif+Devanagari',
  'Noto+Serif+Gurmukhi',
  'Noto+Serif+Bengali',
  'Noto+Serif+Gujarati',
  'Noto+Serif+Tamil',
  'Noto+Serif+Telugu',
  'Noto+Serif+Kannada',
  'Noto+Serif+Malayalam',
  'Noto+Naskh+Arabic',
  'Noto+Serif+Hebrew',
  'Noto+Serif+Georgian',
  'Noto+Serif+Armenian',
  'Noto+Serif+JP',
  'Noto+Serif+KR',
  'Noto+Serif+SC',
]
  .map((f) => `family=${f}`)
  .join('&')

export const metadata: Metadata = {
  title: 'messageforya',
  description: 'A small note made just for you.',
  applicationName: 'messageforya',
  generator: 'messageforya',
  referrer: 'no-referrer',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: 'messageforya',
    description: 'A small note made just for you.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'messageforya',
    description: 'A small note made just for you.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5ecdc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${hand.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${scriptFonts}&display=swap`} />
      </head>
      <body className="paper font-serif antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
