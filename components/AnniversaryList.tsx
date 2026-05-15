'use client'

import { useState } from 'react'
import { Anniversary, SortOrder, sortAnniversaries } from '@/utils/anniversaries'
import AnniversaryCard from './AnniversaryCard'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'near', label: '近い順' },
  { value: 'far', label: '遠い順' },
  { value: 'added', label: '追加順' },
]

export default function AnniversaryList({ items }: { items: Anniversary[] }) {
  const [sort, setSort] = useState<SortOrder>('near')
  const sorted = sortAnniversaries(items, sort)

  return (
    <div>
      {/* ソートバー */}
      <div className="mb-5 flex gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{
              background: sort === opt.value ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
              color: sort === opt.value ? '#a78bfa' : '#4b5563',
              border: `1px solid ${sort === opt.value ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* カードグリッド */}
      <div className="flex flex-col gap-1.5">
        {sorted.map((item, i) => (
          <AnniversaryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
