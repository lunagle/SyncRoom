'use client'

import { useState, useRef, useTransition } from 'react'
import { addAnniversary } from '@/app/actions'

type Period = 'yearly' | 'monthly'

export default function AddRecurringModal() {
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<Period>('yearly')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    formData.set('type', 'future')
    formData.set('recurring_period', period)
    startTransition(async () => {
      await addAnniversary(formData)
      formRef.current?.reset()
      setOpen(false)
      setPeriod('yearly')
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #fbbf24, #a78bfa)', color: '#fff' }}
      >
        +
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>繰り返し記念日を追加</h2>
              <button onClick={() => setOpen(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
              {/* 毎年・毎月切替 */}
              <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => setPeriod('yearly')}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: period === 'yearly' ? 'rgba(251,191,36,0.2)' : 'transparent',
                    color: period === 'yearly' ? '#fbbf24' : '#6b7280',
                  }}>
                  📅 毎年
                </button>
                <button type="button" onClick={() => setPeriod('monthly')}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: period === 'monthly' ? 'rgba(139,92,246,0.2)' : 'transparent',
                    color: period === 'monthly' ? '#a78bfa' : '#6b7280',
                  }}>
                  🗓 毎月
                </button>
              </div>

              {/* タイトル */}
              <input
                name="title"
                type="text"
                required
                placeholder={period === 'yearly' ? '承美の誕生日' : '記念日'}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-30"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f0f2ff',
                }}
              />

              {/* 日付 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: '#6b7280' }}>
                  {period === 'yearly' ? '日付（年は問いません）' : '日付（日付のみ使用）'}
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f0f2ff',
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #a78bfa)', color: '#fff' }}
              >
                {isPending ? '追加中...' : '追加する'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
