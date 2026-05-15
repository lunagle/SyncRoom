import { createAdminClient } from '@/utils/supabase/admin'
import RecurringList from '@/components/RecurringList'
import AddRecurringModal from '@/components/AddRecurringModal'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 3600

export default async function RecurringPage() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('anniversaries')
    .select('*')
    .neq('recurring_period', 'none')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen px-6 py-12 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            繰り返し記念日
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>毎年・毎月の大切な日</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error.message}
          </div>
        )}

        {data && data.length > 0 ? (
          <RecurringList items={data as Anniversary[]} />
        ) : (
          <div className="rounded-2xl border py-16 text-center text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }}>
            繰り返し記念日がまだありません
          </div>
        )}
      </div>
      <AddRecurringModal />
    </main>
  )
}
