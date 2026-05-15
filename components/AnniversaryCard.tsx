'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import {
  Anniversary, DisplayMode, DISPLAY_MODES, MODE_LABELS,
  calculateDays, calculateHours, calculateBreakdown,
  formatDate, formatMonthDay, getAutoMode, getEffectiveDate,
} from '@/utils/anniversaries'
import { deleteAnniversary, updateAnniversary } from '@/app/actions'

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

type Props = { item: Anniversary; index?: number }

function DisplayValue({ date, type, mode, isPast }: {
  date: string; type: 'past' | 'future'; mode: DisplayMode; isPast: boolean
}) {
  const accent = isPast ? '#c4b5fd' : '#67e8f9'

  if (mode === 'breakdown') {
    const { years, months, days } = calculateBreakdown(date, type)
    const animYears = useCountUp(years)
    const animMonths = useCountUp(months)
    const animDays = useCountUp(days)
    return (
      <div className="flex items-end gap-3 flex-wrap">
        {years > 0 && (
          <span className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold tabular-nums tracking-tight animate-count-up" style={{ color: '#f0f2ff' }}>{animYears}</span>
            <span className="text-xs ml-0.5" style={{ color: '#6b7280' }}>年</span>
          </span>
        )}
        {months > 0 && (
          <span className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold tabular-nums tracking-tight animate-count-up" style={{ color: '#f0f2ff' }}>{animMonths}</span>
            <span className="text-xs ml-0.5" style={{ color: '#6b7280' }}>ヶ月</span>
          </span>
        )}
        <span className="flex items-baseline gap-0.5">
          <span className="text-3xl font-bold tabular-nums tracking-tight animate-count-up" style={{ color: '#f0f2ff' }}>{animDays}</span>
          <span className="text-xs ml-0.5" style={{ color: '#6b7280' }}>日</span>
        </span>
      </div>
    )
  }

  const raw = mode === 'days' ? calculateDays(date, type) : calculateHours(date, type)
  const animated = useCountUp(raw)
  return (
    <div className="flex items-baseline gap-1.5">
      {!isPast && <span className="text-xs font-light" style={{ color: '#6b7280' }}>あと</span>}
      <span className="text-4xl font-bold tabular-nums tracking-tight animate-count-up" style={{ color: '#f0f2ff' }}>
        {animated.toLocaleString()}
      </span>
      <span className="text-sm font-light" style={{ color: accent }}>{mode === 'days' ? '日' : '時間'}</span>
      {isPast && mode !== 'breakdown' && <span className="text-xs font-light" style={{ color: '#4b5563' }}>経過</span>}
    </div>
  )
}

export default function AnniversaryCard({ item, index = 0 }: Props) {
  const isPast = item.type === 'past'
  const effectiveDate = getEffectiveDate(item)
  const [mode, setMode] = useState<DisplayMode>(() => getAutoMode(effectiveDate, item.type))
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [editType, setEditType] = useState<'past' | 'future'>(item.type)
  const [editRecurring, setEditRecurring] = useState(item.recurring)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleUpdate(formData: FormData) {
    formData.set('type', editType)
    formData.set('recurring_period', 'none')
    formData.set('recurring', String(editRecurring))
    startTransition(async () => { await updateAnniversary(item.id, formData); setEditing(false) })
  }

  function handleDelete() {
    startTransition(async () => { await deleteAnniversary(item.id) })
  }

  const accent = isPast ? '#8b5cf6' : '#06b6d4'
  const accentFaint = isPast ? 'rgba(139,92,246,0.1)' : 'rgba(6,182,212,0.08)'
  const accentText = isPast ? '#c4b5fd' : '#67e8f9'

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl p-3 transition-all duration-300 animate-fade-in-up ${isPast ? 'card-glow-past' : 'card-glow-future'}`}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          animationDelay: `${index * 60}ms`,
        }}
      >
        {/* 左アクセントライン */}
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: accent }} />

        {/* タイトル行 */}
        <div className="flex items-center justify-between mb-1.5 pl-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate" style={{ color: '#f0f2ff' }}>{item.title}</h3>
            {item.recurring && <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>毎年</span>}
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <button onClick={() => { setEditing(true); setConfirming(false) }}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ color: '#374151' }}>編集</button>
            {confirming ? (
              <>
                <button onClick={handleDelete} disabled={isPending}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ color: '#f87171' }}>削除</button>
                <button onClick={() => setConfirming(false)}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ color: '#374151' }}>✕</button>
              </>
            ) : (
              <button onClick={() => setConfirming(true)}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ color: '#374151' }}>削除</button>
            )}
          </div>
        </div>

        {/* メイン数値 + 日付 */}
        <div className="pl-3 mb-2">
          <DisplayValue date={effectiveDate} type={item.type} mode={mode} isPast={isPast} />
          <p className="mt-0.5 text-xs" style={{ color: '#374151' }}>
            {item.recurring ? `次回: ${formatDate(effectiveDate)}` : formatDate(item.date)}
          </p>
        </div>

        {/* 単位切替 */}
        <div className="pl-3 flex gap-1">
          {DISPLAY_MODES.map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="rounded-full px-2 py-0.5 text-xs transition-all duration-200"
              style={{
                background: mode === m ? accentFaint : 'transparent',
                color: mode === m ? accentText : '#374151',
                border: `1px solid ${mode === m ? accent : 'rgba(255,255,255,0.05)'}`,
              }}>
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* 編集モーダル */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}>
          <div className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>記念日を編集</h2>
              <button onClick={() => setEditing(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>
            <form ref={formRef} action={handleUpdate} className="flex flex-col gap-5">
              <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => { setEditType('past'); setEditRecurring(false) }}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{ background: editType === 'past' ? 'rgba(139,92,246,0.25)' : 'transparent', color: editType === 'past' ? '#a78bfa' : '#6b7280' }}>
                  〇〇からの日数
                </button>
                <button type="button" onClick={() => setEditType('future')}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{ background: editType === 'future' ? 'rgba(6,182,212,0.2)' : 'transparent', color: editType === 'future' ? '#22d3ee' : '#6b7280' }}>
                  〇〇までの日数
                </button>
              </div>
              <input name="title" type="text" required defaultValue={item.title}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff' }} />
              <input name="date" type="date" required defaultValue={item.date}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff', colorScheme: 'dark' }} />
              <button type="submit" disabled={isPending}
                className="mt-1 w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}>
                {isPending ? '保存中...' : '保存する'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
