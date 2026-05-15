import { createAdminClient } from '@/utils/supabase/admin'
import AnniversaryList from '@/components/AnniversaryList'
import AddAnniversaryModal from '@/components/AddAnniversaryModal'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 3600

export default async function MemoriesPage() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('anniversaries')
    .select('*')
    .eq('type', 'past')
    .eq('recurring_period', 'none')
    .order('date', { ascending: true })

  return (
    <main className="min-h-screen px-2 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            時間記録
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>〇〇からの日数</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error.message}
          </div>
        )}

        {data && data.length > 0 ? (
          <AnniversaryList items={data as Anniversary[]} />
        ) : (
          <div className="rounded-2xl border py-16 text-center text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }}>
            記録がまだありません
          </div>
        )}
      </div>
      <AddAnniversaryModal defaultType="past" />
    </main>
  )
}
