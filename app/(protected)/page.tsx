import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import TodoList from '@/components/TodoList'
import { Anniversary, sortAnniversaries, getEffectiveDate, calculateDays } from '@/utils/anniversaries'
import { Todo } from '@/app/todo/page'

export const revalidate = 0

export default async function HomePage() {
  const supabase = createAdminClient()

  const [{ data: anniversaries }, { data: recurring }, { data: todos }] = await Promise.all([
    supabase.from('anniversaries').select('*').eq('type', 'future').eq('recurring_period', 'none'),
    supabase.from('anniversaries').select('*').neq('recurring_period', 'none'),
    supabase.from('todos').select('*').order('created_at', { ascending: true }),
  ])

  const allCountdowns = [...(anniversaries ?? []), ...(recurring ?? [])] as Anniversary[]
  const sorted = sortAnniversaries(allCountdowns, 'near').slice(0, 3)

  return (
    <main className="min-h-screen px-4 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2ff' }}>SyncRoom</h1>
          <p className="text-sm" style={{ color: '#4b5563' }}>ふたりの今と奇跡を繋ぐ</p>
        </div>

        {/* カウントダウンサマリー */}
        {sorted.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold" style={{ color: '#6b7280' }}>もうすぐの予定</h2>
              <Link href="/countdown" className="text-xs" style={{ color: '#a78bfa' }}>すべて見る →</Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {sorted.map((item) => {
                const days = calculateDays(getEffectiveDate(item), item.type)
                const accent = item.recurring ? '#fbbf24' : '#06b6d4'
                return (
                  <div key={item.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `2px solid ${accent}` }}>
                    <span className="text-sm" style={{ color: '#e5e7eb' }}>{item.title}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>
                      あと{days.toLocaleString()}日
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ToDoリスト */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#6b7280' }}>やることリスト</h2>
          <TodoList items={(todos ?? []) as Todo[]} />
        </section>
      </div>
    </main>
  )
}
