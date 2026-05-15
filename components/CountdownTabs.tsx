'use client'

import { useState } from 'react'
import { Anniversary } from '@/utils/anniversaries'
import AnniversaryList from './AnniversaryList'
import AddAnniversaryModal from './AddAnniversaryModal'
import AddRecurringModal from './AddRecurringModal'

type Tab = 'countdown' | 'recurring' | 'memories'

const TABS: { value: Tab; label: string }[] = [
  { value: 'countdown', label: 'カウントダウン' },
  { value: 'recurring', label: '記念日' },
  { value: 'memories', label: '記録' },
]

type Props = {
  countdowns: Anniversary[]
  recurring: Anniversary[]
  memories: Anniversary[]
}

export default function CountdownTabs({ countdowns, recurring, memories }: Props) {
  const [tab, setTab] = useState<Tab>('countdown')

  const items = tab === 'countdown' ? countdowns : tab === 'recurring' ? recurring : memories
  const isPast = tab === 'memories'
  const isEmpty = items.length === 0

  const emptyMsg = {
    countdown: 'カウントダウンがまだありません',
    recurring: '繰り返し記念日がまだありません',
    memories: '記録がまだありません',
  }[tab]

  return (
    <>
      {/* タブ */}
      <div className="mb-4 flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-all"
            style={{
              background: tab === t.value ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: tab === t.value ? '#a78bfa' : '#6b7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      {isEmpty ? (
        <div className="rounded-2xl border py-16 text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }}>
          {emptyMsg}
        </div>
      ) : (
        <AnniversaryList items={items} />
      )}

      {/* 追加ボタン */}
      {tab === 'countdown' && <AddAnniversaryModal defaultType="future" />}
      {tab === 'memories' && <AddAnniversaryModal defaultType="past" />}
      {tab === 'recurring' && <AddRecurringModal />}
    </>
  )
}
