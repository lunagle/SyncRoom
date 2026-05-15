import { createAdminClient } from '@/utils/supabase/admin'
import CountdownTabs from '@/components/CountdownTabs'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 3600

export default async function CountdownPage() {
  const supabase = createAdminClient()

  const [{ data: futures }, { data: recurring }, { data: past }] = await Promise.all([
    supabase.from('anniversaries').select('*').eq('type', 'future').eq('recurring_period', 'none'),
    supabase.from('anniversaries').select('*').neq('recurring_period', 'none'),
    supabase.from('anniversaries').select('*').eq('type', 'past').eq('recurring_period', 'none'),
  ])

  return (
    <main className="min-h-screen px-2 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
          カウントダウン
        </h1>
      </div>
      <CountdownTabs
        countdowns={(futures ?? []) as Anniversary[]}
        recurring={(recurring ?? []) as Anniversary[]}
        memories={(past ?? []) as Anniversary[]}
      />
    </main>
  )
}
