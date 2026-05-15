'use client'

import { useState, useRef, useTransition } from 'react'
import {
  Anniversary,
  DisplayMode,
  DISPLAY_MODES,
  MODE_LABELS,
  calculateDays,
  calculateHours,
  calculateBreakdown,
  formatDate,
  formatMonthDay,
  getAutoMode,
  getEffectiveDate,
} from '@/utils/anniversaries'
import { deleteAnniversary, updateAnniversary } from '@/app/actions'

type Props = { item: Anniversary }

function DisplayValue({
  date, type, mode, isPast,
}: {
  date: string; type: 'past' | 'future'; mode: DisplayMode; isPast: boolean
}) {
  const gradient = isPast
    ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    : 'linear-gradient(135deg, #06b6d4, #a78bfa)'
  const gradientStyle = {
    background: gradient,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  }

  if (mode === 'breakdown') {
    const { years, months, days } = calculateBreakdown(date, type)
    return (
      <div className="flex items-baseline gap-3 flex-wrap">
        {years > 0 && (
          <span className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tabular-nums tracking-tight" style={gradientStyle}>{years}</span>
            <span className="text-sm font-light" style={{ color: '#9ca3af' }}>年</span>
          </span>
        )}
        {months > 0 && (
          <span className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tabular-nums tracking-tight" style={gradientStyle}>{months}</span>
            <span className="text-sm font-light" style={{ color: '#9ca3af' }}>ヶ月</span>
          </span>
        )}
        <span className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums tracking-tight" style={gradientStyle}>{days}</span>
          <span className="text-sm font-light" style={{ color: '#9ca3af' }}>日</span>
        </span>
      </div>
    )
  }

  const value = mode === 'days' ? calculateDays(date, type) : calculateHours(date, type)
  return (
    <div className="flex items-baseline gap-1.5">
      {!isPast && <span className="text-sm font-light" style={{ color: '#9ca3af' }}>あと</span>}
      <span className="text-5xl font-bold tabular-nums tracking-tight" style={gradientStyle}>
        {value.toLocaleString()}
      </span>
      <span className="text-sm font-light" style={{ color: '#9ca3af' }}>
        {mode === 'days' ? '日' : '時間'}
      </span>
    </div>
  )
}

export default function AnniversaryCard({ item }: Props) {
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
    formData.set('recurring', String(editRecurring))
    startTransition(async () => {
      await updateAnniversary(item.id, formData)
      setEditing(false)
    })
  }

  function handleDelete() {
    startTransition(async () => { await deleteAnniversary(item.id) })
  }

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl border p-6 transition-transform hover:-translate-y-0.5"
        style={{ background: 'rgba(8,12,24,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="absolute left-0 top-0 h-full w-0.5 rounded-full"
          style={{
            background: isPast
              ? 'linear-gradient(180deg, #8b5cf6, #a78bfa)'
              : 'linear-gradient(180deg, #06b6d4, #a78bfa)',
          }}
        />

        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => { setEditing(true); setConfirming(false) }}
            className="rounded-lg px-2 py-1 text-xs"
            style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)' }}
          >編集</button>
          {confirming ? (
            <div className="flex gap-1">
              <button onClick={handleDelete} disabled={isPending} className="rounded-lg px-2 py-1 text-xs"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>削除する</button>
              <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1 text-xs"
                style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)' }}>戻る</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="rounded-lg px-2 py-1 text-xs"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)' }}>削除</button>
          )}
        </div>

        <div className="pl-2 pt-1">
          {/* バッジ */}
          <div className="mb-3 flex gap-2 flex-wrap">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide"
              style={{
                background: isPast ? 'rgba(139,92,246,0.15)' : 'rgba(6,182,212,0.12)',
                color: isPast ? '#a78bfa' : '#22d3ee',
              }}
            >
              {isPast ? '〇〇からの日数' : '〇〇までの日数'}
            </span>
            {item.recurring && (
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
              >
                🔁 毎年
              </span>
            )}
          </div>

          <h3 className="mb-1 text-base font-semibold" style={{ color: '#f0f2ff' }}>{item.title}</h3>
          <p className="mb-5 text-sm" style={{ color: '#6b7280' }}>
            {item.recurring
              ? `毎年 ${formatMonthDay(item.date)}（次回: ${formatDate(effectiveDate)}）`
              : formatDate(item.date)
            }
          </p>

          <DisplayValue date={effectiveDate} type={item.type} mode={mode} isPast={isPast} />

          {isPast && mode !== 'breakdown' && (
            <p className="mt-1 text-xs" style={{ color: '#4b5563' }}>から経過</p>
          )}

          <div className="mt-4 flex gap-1.5">
            {DISPLAY_MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                style={{
                  background: mode === m
                    ? isPast ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  color: mode === m ? (isPast ? '#a78bfa' : '#22d3ee') : '#4b5563',
                  border: `1px solid ${mode === m
                    ? isPast ? 'rgba(139,92,246,0.3)' : 'rgba(6,182,212,0.25)'
                    : 'transparent'}`,
                }}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <div className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>記念日を編集</h2>
              <button onClick={() => setEditing(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>

            <form ref={formRef} action={handleUpdate} className="flex flex-col gap-5">
              <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => { setEditType('past'); setEditRecurring(false) }}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: editType === 'past' ? 'rgba(139,92,246,0.25)' : 'transparent',
                    color: editType === 'past' ? '#a78bfa' : '#6b7280',
                  }}>〇〇からの日数</button>
                <button type="button" onClick={() => setEditType('future')}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: editType === 'future' ? 'rgba(6,182,212,0.2)' : 'transparent',
                    color: editType === 'future' ? '#22d3ee' : '#6b7280',
                  }}>〇〇までの日数</button>
              </div>

              <input name="title" type="text" required defaultValue={item.title}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff' }}
              />

              <input name="date" type="date" required defaultValue={item.date}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff', colorScheme: 'dark' }}
              />

              {editType === 'future' && (
                <button type="button" onClick={() => setEditRecurring(!editRecurring)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    background: editRecurring ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${editRecurring ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: editRecurring ? '#22d3ee' : '#6b7280',
                  }}>
                  <span>🔁 毎年繰り返す（誕生日など）</span>
                  <span className="ml-auto h-5 w-9 rounded-full transition-all"
                    style={{ background: editRecurring ? 'linear-gradient(135deg, #06b6d4, #a78bfa)' : 'rgba(255,255,255,0.1)' }}
                  />
                </button>
              )}

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
