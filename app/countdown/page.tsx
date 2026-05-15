import { createAdminClient } from '@/utils/supabase/admin'
import AnniversaryList from '@/components/AnniversaryList'
import AddAnniversaryModal from '@/components/AddAnniversaryModal'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 3600

export default async function CountdownPage() {
  const supabase = createAdminClient()

  const [{ data: futures }, { data: recurring }] = await Promise.all([
    supabase.from('anniversaries').select('*').eq('type', 'future').eq('recurring_period', 'none'),
    supabase.from('anniversaries').select('*').neq('recurring_period', 'none'),
  ])

  const items = [...(futures ?? []), ...(recurring ?? [])] as Anniversary[]

  return (
    <main className="min-h-screen px-2 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div>
        <div className="mb-10 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            カウントダウン
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>〇〇までの日数</p>
        </div>

        {items.length > 0 ? (
          <AnniversaryList items={items} />
        ) : (
          <div className="rounded-2xl border py-16 text-center text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }}>
            カウントダウンがまだありません
          </div>
        )}
      </div>
      <AddAnniversaryModal defaultType="future" />
    </main>
  )
}
