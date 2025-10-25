import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import BotStarter from '@/components/BotStarter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RimuruTR - Medya İndirici',
  description: 'YouTube, TikTok, Instagram ve Twitter\'dan medya indirin',
  keywords: 'medya indirici, youtube, tiktok, instagram, twitter, video indir',
  authors: [{ name: 'RimuruTR' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <BotStarter />
        {children}
      </body>
    </html>
  )
}
