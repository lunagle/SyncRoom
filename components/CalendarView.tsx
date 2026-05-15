'use client'

import { useState, useTransition } from 'react'
import { CalendarEvent } from '@/app/calendar/page'
import { Anniversary, getEffectiveDate } from '@/utils/anniversaries'
import { addEvent, deleteEvent } from '@/app/actions'

type DayMark = { type: 'event' | 'anniversary'; title: string; id: string; color: string }

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function todayYMD() {
  const t = new Date()
  return toYMD(t.getFullYear(), t.getMonth(), t.getDate())
}

export default function CalendarView({ events, anniversaries }: { events: CalendarEvent[]; anniversaries: Anniversary[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const todayStr = todayYMD()

  // 各日付にマークを付ける
  const marks: Record<string, DayMark[]> = {}
  events.forEach((e) => {
    if (!marks[e.date]) marks[e.date] = []
    marks[e.date].push({ type: 'event', title: e.title, id: e.id, color: '#a78bfa' })
  })
  anniversaries.forEach((a) => {
    const d = getEffectiveDate(a)
    if (!marks[d]) marks[d] = []
    marks[d].push({ type: 'anniversary', title: a.title, id: a.id, color: a.type === 'future' ? '#67e8f9' : '#f9a8d4' })
  })

  // カレンダーグリッド生成
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const selectedDate = selected
  const selectedMarks = selectedDate ? (marks[selectedDate] ?? []) : []
  const selectedEvents = events.filter((e) => e.date === selectedDate)

  function handleAdd(formData: FormData) {
    setErrorMsg(null)
    startTransition(async () => {
      const result = await addEvent(formData)
      if (result?.error) { setErrorMsg(result.error); return }
      setShowAdd(false)
    })
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>‹</button>
        <span className="text-base font-semibold" style={{ color: '#f0f2ff' }}>
          {year}年{month + 1}月
        </span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>›</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className="text-center text-xs py-1 font-medium"
            style={{ color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : '#4b5563' }}>{d}</div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-0.5 mb-5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = toYMD(year, month, day)
          const dayMarks = marks[dateStr] ?? []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selected
          const dow = i % 7

          return (
            <button
              key={i}
              onClick={() => setSelected(isSelected ? null : dateStr)}
              className="flex flex-col items-center py-1.5 rounded-xl transition-all"
              style={{
                background: isSelected ? 'rgba(167,139,250,0.2)' : isToday ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: isSelected ? '1px solid rgba(167,139,250,0.5)' : '1px solid transparent',
              }}
            >
              <span className="text-sm font-medium leading-none mb-1"
                style={{
                  color: isSelected ? '#a78bfa' : isToday ? '#f0f2ff' : dow === 0 ? '#f87171' : dow === 6 ? '#60a5fa' : '#9ca3af',
                }}>
                {day}
              </span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {dayMarks.slice(0, 3).map((m, j) => (
                  <div key={j} className="w-1 h-1 rounded-full" style={{ background: m.color }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* 選択日の詳細 */}
      {selectedDate && (
        <div className="mb-4 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#f0f2ff' }}>
              {year}年{month + 1}月{selectedDate.split('-')[2]}日
            </span>
            <button onClick={() => { setAddDate(selectedDate); setShowAdd(true) }}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
              + 追加
            </button>
          </div>

          {selectedMarks.length === 0 && (
            <p className="text-xs" style={{ color: '#374151' }}>予定なし</p>
          )}

          <div className="flex flex-col gap-2">
            {selectedMarks.map((m, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-sm truncate" style={{ color: '#e5e7eb' }}>{m.title}</span>
                  <span className="text-xs shrink-0" style={{ color: '#4b5563' }}>
                    {m.type === 'anniversary' ? '記念日' : '予定'}
                  </span>
                </div>
                {m.type === 'event' && (
                  <button onClick={() => startTransition(async () => { await deleteEvent(m.id) })}
                    className="text-xs shrink-0" style={{ color: '#374151' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 追加ボタン（日付未選択時） */}
      {!selectedDate && (
        <button onClick={() => { setAddDate(''); setShowAdd(true) }}
          className="w-full rounded-2xl py-3 text-sm font-semibold"
          style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
          + 予定を追加
        </button>
      )}

      {/* 追加モーダル */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>予定を追加</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAdd(new FormData(e.currentTarget)) }}
              className="flex flex-col gap-4">
              <input name="title" type="text" required placeholder="タイトル"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff' }} />
              <input name="date" type="date" required defaultValue={addDate}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff', colorScheme: 'dark' }} />
              <input name="note" type="text" placeholder="メモ（任意）"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff' }} />
              {errorMsg && <p className="text-xs" style={{ color: '#f87171' }}>{errorMsg}</p>}
              <button type="submit" disabled={isPending}
                className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}>
                {isPending ? '保存中...' : '保存する'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
