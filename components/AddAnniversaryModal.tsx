'use client'

import { useState, useRef, useTransition } from 'react'
import { addAnniversary } from '@/app/actions'

export default function AddAnniversaryModal() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'past' | 'future'>('past')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    formData.set('type', type)
    startTransition(async () => {
      await addAnniversary(formData)
      formRef.current?.reset()
      setOpen(false)
      setType('past')
    })
  }

  return (
    <>
      {/* 追加ボタン */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          color: '#fff',
        }}
      >
        +
      </button>

      {/* オーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* モーダル */}
          <div
            className="w-full max-w-md rounded-t-3xl p-6 sm:rounded-2xl"
            style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#f0f2ff' }}>
                記念日を追加
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-lg leading-none"
                style={{ color: '#6b7280' }}
              >
                ✕
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
              {/* タイプ切替 */}
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <button
                  type="button"
                  onClick={() => setType('past')}
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: '#6b7280' }}>
                  {type === 'past' ? '例：付き合ってから' : '例：次の誕生日まで'}
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder={type === 'past' ? '付き合ってから' : '次の誕生日まで'}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-30"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f0f2ff',
                  }}
                />
              </div>

              {/* 日付 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: '#6b7280' }}>
                  {type === 'past' ? '基準日' : '予定日'}
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

              {/* 送信 */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full rounded-xl py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  color: '#fff',
                }}
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
