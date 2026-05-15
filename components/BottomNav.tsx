'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/countdown', label: 'カウントダウン', icon: '⏳' },
  { href: '/memories', label: '時間記録', icon: '📅' },
  { href: '/todo', label: 'やること', icon: '✅' },
  { href: '/recurring', label: '繰り返し', icon: '🔁' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: 'rgba(8,12,24,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={{ color: active ? '#a78bfa' : '#4b5563' }}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
