import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import { cookies } from 'next/headers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SyncRoom',
  description: 'ふたりの今と奇跡を繋ぐ、デジタルルーム',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const hasSession = cookieStore.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: '#050810' }}>
        <div className={hasSession ? 'pb-20' : ''}>{children}</div>
        {hasSession && <BottomNav />}
      </body>
    </html>
  )
}
