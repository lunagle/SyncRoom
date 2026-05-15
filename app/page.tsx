import { createAdminClient } from '@/utils/supabase/admin'
import AnniversaryCard from '@/components/AnniversaryCard'
import AddAnniversaryModal from '@/components/AddAnniversaryModal'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 3600

export default async function Home() {
  const supabase = createAdminClient()
  const { data: anniversaries, error } = await supabase
    .from('anniversaries')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main
      className="min-h-screen px-6 py-16 font-sans"
      style={{ background: '#050810', color: '#f0f2ff' }}
    >
      <div className="mx-auto max-w-2xl">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <h1
            className="mb-2 text-3xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SyncRoom
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            ふたりの今と奇跡を繋ぐ、デジタルルーム
          </p>
        </div>

        {/* エラー */}
        {error && (
          <div
            className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{
              background: 'rgba(239,68,68,0.08)',
              borderColor: 'rgba(239,68,68,0.2)',
              color: '#f87171',
            }}
          >
            データの取得に失敗しました: {error.message}
          </div>
        )}

        {/* カードグリッド */}
        {anniversaries && anniversaries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {(anniversaries as Anniversary[]).map((item) => (
              <AnniversaryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border py-16 text-center text-sm"
            style={{
              borderColor: 'rgba(255,255,255,0.07)',
              color: '#6b7280',
            }}
          >
            記念日がまだありません
          </div>
        )}
      </div>
      <AddAnniversaryModal />
    </main>
  )
}
