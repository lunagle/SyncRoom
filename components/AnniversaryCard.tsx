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
  const gradient = isPast
    ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    : 'linear-gradient(135deg, #06b6d4, #a78bfa)'
  const gs = { background: gradient, WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const, backgroundClip: 'text' as const }

  if (mode === 'breakdown') {
    const { years, months, days } = calculateBreakdown(date, type)
    const animYears = useCountUp(years)
    const animMonths = useCountUp(months)
    const animDays = useCountUp(days)
    return (
      <div className="flex items-end gap-4 flex-wrap">
        {years > 0 && <span className="flex items-baseline gap-1"><span className="text-6xl font-black tabular-nums tracking-tight animate-count-up" style={gs}>{animYears}</span><span className="text-base" style={{ color: '#9ca3af' }}>年</span></span>}
        {months > 0 && <span className="flex items-baseline gap-1"><span className="text-6xl font-black tabular-nums tracking-tight animate-count-up" style={gs}>{animMonths}</span><span className="text-base" style={{ color: '#9ca3af' }}>ヶ月</span></span>}
        <span className="flex items-baseline gap-1"><span className="text-6xl font-black tabular-nums tracking-tight animate-count-up" style={gs}>{animDays}</span><span className="text-base" style={{ color: '#9ca3af' }}>日</span></span>
      </div>
    )
  }

  const raw = mode === 'days' ? calculateDays(date, type) : calculateHours(date, type)
  const animated = useCountUp(raw)
  return (
    <div className="flex items-baseline gap-2">
      {!isPast && <span className="text-lg font-light" style={{ color: '#9ca3af' }}>あと</span>}
      <span className="text-7xl font-black tabular-nums tracking-tight animate-count-up" style={gs}>
        {animated.toLocaleString()}
      </span>
      <span className="text-lg font-light" style={{ color: '#9ca3af' }}>{mode === 'days' ? '日' : '時間'}</span>
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

  const glowClass = isPast ? 'card-glow-past' : 'card-glow-future'
  const accentGradient = isPast
    ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
    : 'linear-gradient(90deg, #06b6d4, #a78bfa)'
  const cardBg = isPast
    ? 'radial-gradient(ellipse at top left, rgba(139,92,246,0.06) 0%, rgba(8,12,24,0.9) 60%)'
    : 'radial-gradient(ellipse at top left, rgba(6,182,212,0.06) 0%, rgba(8,12,24,0.9) 60%)'

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border p-7 transition-all duration-300 ${glowClass} animate-fade-in-up`}
        style={{
          background: cardBg,
          borderColor: isPast ? 'rgba(139,92,246,0.15)' : 'rgba(6,182,212,0.12)',
          animationDelay: `${index * 80}ms`,
        }}
      >
        {/* グラデーションボーダー上部 */}
        <div className="absolute left-0 top-0 w-full h-px" style={{ background: accentGradient }} />

        {/* アクションボタン */}
        <div className="absolute right-4 top-4 flex gap-1.5">
          <button onClick={() => { setEditing(true); setConfirming(false) }}
            className="rounded-lg px-2.5 py-1 text-xs transition-all"
            style={{ color: '#6b7280', background: 'rgba(255,255,255,0.05)' }}>
            編集
          </button>
          {confirming ? (
            <div className="flex gap-1">
              <button onClick={handleDelete} disabled={isPending} className="rounded-lg px-2.5 py-1 text-xs"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>削除する</button>
              <button onClick={() => setConfirming(false)} className="rounded-lg px-2.5 py-1 text-xs"
                style={{ color: '#6b7280', background: 'rgba(255,255,255,0.05)' }}>戻る</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="rounded-lg px-2.5 py-1 text-xs"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.05)' }}>削除</button>
          )}
        </div>

        <div className="pt-1">
          {/* バッジ */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <span className="inline-block rounded-full px-3 py-0.5 text-xs font-medium"
              style={{
                background: isPast ? 'rgba(139,92,246,0.12)' : 'rgba(6,182,212,0.1)',
                color: isPast ? '#a78bfa' : '#22d3ee',
              }}>
              {isPast ? '経過記録' : 'カウントダウン'}
            </span>
            {item.recurring && (
              <span className="inline-block rounded-full px-3 py-0.5 text-xs font-medium"
                style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                🔁 毎年
              </span>
            )}
          </div>

          {/* タイトル */}
          <h3 className="mb-1 text-lg font-bold" style={{ color: '#f0f2ff' }}>{item.title}</h3>
          <p className="mb-6 text-sm" style={{ color: '#6b7280' }}>
            {item.recurring
              ? `毎年 ${formatMonthDay(item.date)}（次回: ${formatDate(effectiveDate)}）`
              : formatDate(item.date)}
          </p>

          {/* メイン数値 */}
          <DisplayValue date={effectiveDate} type={item.type} mode={mode} isPast={isPast} />

          {isPast && mode !== 'breakdown' && (
            <p className="mt-1.5 text-sm" style={{ color: '#4b5563' }}>から経過</p>
          )}

          {/* 単位切替 */}
          <div className="mt-6 flex gap-2">
            {DISPLAY_MODES.map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  background: mode === m
                    ? isPast ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  color: mode === m ? (isPast ? '#a78bfa' : '#22d3ee') : '#4b5563',
                  border: `1px solid ${mode === m
                    ? isPast ? 'rgba(139,92,246,0.35)' : 'rgba(6,182,212,0.3)'
                    : 'rgba(255,255,255,0.06)'}`,
                }}>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
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
