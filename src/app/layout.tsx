/**
 * Root Layout
 * 
 * The main layout wrapper for the entire Safha application.
 * Sets up fonts, global styles, and provides necessary context providers.
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

// Primary sans-serif font for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Display font for headings
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Safha | Volunteer Platform',
    template: '%s | Safha',
  },
  description:
    'Connect with meaningful volunteer opportunities in your community. Safha makes it easy to find, join, and track your impact.',
  keywords: ['volunteer', 'nonprofit', 'community', 'impact', 'charity'],
  authors: [{ name: 'Safha Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Safha | Volunteer Platform',
    description: 'Connect with meaningful volunteer opportunities in your community.',
    siteName: 'Safha',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
