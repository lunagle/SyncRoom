'use client'

import { useState, useTransition } from 'react'
import { Anniversary, calculateDays, formatDate, formatMonthDay, formatDay, getEffectiveDate } from '@/utils/anniversaries'
import { deleteAnniversary } from '@/app/actions'

function RecurringItem({ item }: { item: Anniversary }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isYearly = item.recurring_period === 'yearly'
  const nextDate = getEffectiveDate(item)
  const daysUntil = calculateDays(nextDate, 'future')

  function handleDelete() {
    startTransition(async () => { await deleteAnniversary(item.id) })
  }

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border px-5 py-4"
      style={{ background: 'rgba(8,12,24,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {/* 左：アイコン */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ background: isYearly ? 'rgba(251,191,36,0.12)' : 'rgba(139,92,246,0.12)' }}
      >
        {isYearly ? '📅' : '🗓'}
      </div>

      {/* 中：情報 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" style={{ color: '#f0f2ff' }}>{item.title}</p>
        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
          {isYearly ? `毎年 ${formatMonthDay(item.date)}` : `毎月 ${formatDay(item.date)}`}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>
          次回: {formatDate(nextDate)}
        </p>
      </div>

      {/* 右：あと〇日 + アクション */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className="text-sm font-bold tabular-nums"
          style={{
            background: isYearly
              ? 'linear-gradient(135deg, #fbbf24, #a78bfa)'
              : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          あと{daysUntil}日
        </span>
        {confirming ? (
          <div className="flex gap-1">
            <button onClick={handleDelete} disabled={isPending}
              className="rounded-lg px-2 py-0.5 text-xs"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>削除</button>
            <button onClick={() => setConfirming(false)}
              className="rounded-lg px-2 py-0.5 text-xs"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)' }}>戻る</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}
            className="rounded-lg px-2 py-0.5 text-xs"
            style={{ color: '#4b5563', background: 'rgba(255,255,255,0.04)' }}>削除</button>
        )}
      </div>
    </div>
  )
}

export default function RecurringList({ items }: { items: Anniversary[] }) {
  const yearly = items.filter(i => i.recurring_period === 'yearly')
  const monthly = items.filter(i => i.recurring_period === 'monthly')

  return (
    <div className="flex flex-col gap-8">
      {yearly.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest" style={{ color: '#6b7280' }}>
            毎年
          </h2>
          <div className="flex flex-col gap-3">
            {yearly.map(item => <RecurringItem key={item.id} item={item} />)}
          </div>
        </section>
      )}
      {monthly.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest" style={{ color: '#6b7280' }}>
            毎月
          </h2>
          <div className="flex flex-col gap-3">
            {monthly.map(item => <RecurringItem key={item.id} item={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
