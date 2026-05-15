import { createAdminClient } from '@/utils/supabase/admin'
import CalendarView from '@/components/CalendarView'
import { Anniversary } from '@/utils/anniversaries'

export const revalidate = 0

export type CalendarEvent = {
  id: string
  title: string
  date: string
  note: string | null
  created_at: string
}

export default async function CalendarPage() {
  const supabase = createAdminClient()

  const [{ data: events }, { data: anniversaries }] = await Promise.all([
    supabase.from('events').select('*').order('date'),
    supabase.from('anniversaries').select('*'),
  ])

  return (
    <main className="min-h-screen px-3 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-5">
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2ff' }}>カレンダー</h1>
          <p className="text-sm" style={{ color: '#4b5563' }}>二人の予定</p>
        </div>
        <CalendarView
          events={(events ?? []) as CalendarEvent[]}
          anniversaries={(anniversaries ?? []) as Anniversary[]}
        />
      </div>
    </main>
  )
}
