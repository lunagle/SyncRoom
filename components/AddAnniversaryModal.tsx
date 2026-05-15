'use client'

import { useState, useRef, useTransition } from 'react'
import { addAnniversary } from '@/app/actions'

export default function AddAnniversaryModal() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'past' | 'future'>('past')
  const [recurring, setRecurring] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    formData.set('type', type)
    formData.set('recurring', String(recurring))
    startTransition(async () => {
      await addAnniversary(formData)
      formRef.current?.reset()
      setOpen(false)
      setType('past')
      setRecurring(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}
      >
        +
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>記念日を追加</h2>
              <button onClick={() => setOpen(false)} style={{ color: '#6b7280' }}>✕</button>
            </div>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
              {/* タイプ切替 */}
              <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <button
                  type="button"
                  onClick={() => { setType('past'); setRecurring(false) }}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: type === 'past' ? 'rgba(139,92,246,0.25)' : 'transparent',
                    color: type === 'past' ? '#a78bfa' : '#6b7280',
                  }}
                >
                  〇〇からの日数
                </button>
                <button
                  type="button"
                  onClick={() => setType('future')}
                  className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: type === 'future' ? 'rgba(6,182,212,0.2)' : 'transparent',
                    color: type === 'future' ? '#22d3ee' : '#6b7280',
                  }}
                >
                  〇〇までの日数
                </button>
              </div>

              {/* タイトル */}
              <input
                name="title"
                type="text"
                required
                placeholder={type === 'past' ? '付き合ってから' : '次の誕生日まで'}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-30"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f0f2ff',
                }}
              />

              {/* 日付 */}
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

              {/* 毎年繰り返し（futureのみ） */}
              {type === 'future' && (
                <button
                  type="button"
                  onClick={() => setRecurring(!recurring)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    background: recurring ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${recurring ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: recurring ? '#22d3ee' : '#6b7280',
                  }}
                >
                  <span className="text-base">{recurring ? '🔁' : '🔁'}</span>
                  <span>毎年繰り返す（誕生日など）</span>
                  <span
                    className="ml-auto h-5 w-9 rounded-full transition-all"
                    style={{
                      background: recurring
                        ? 'linear-gradient(135deg, #06b6d4, #a78bfa)'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </button>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}
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
