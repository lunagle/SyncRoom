import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import CalendarView from '@/components/CalendarView'
import { Anniversary } from '@/utils/anniversaries'
import { requireAuth } from '@/utils/auth'

export const revalidate = 0

export type CalendarEvent = {
  id: string
  title: string
  date: string
  note: string | null
  created_at: string
}

export type GoogleEvent = {
  id: string
  title: string
  date: string
  endDate?: string
}

async function fetchGoogleCalendarEvents(accessToken: string): Promise<GoogleEvent[]> {
  const now = new Date()
  const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

  const params = new URLSearchParams({
    timeMin: threeMonthsAgo.toISOString(),
    timeMax: oneYearLater.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '100',
  })

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!res.ok) return []

  const data = await res.json()
  return (data.items ?? []).map((item: any) => ({
    id: item.id,
    title: item.summary ?? '(タイトルなし)',
    date: (item.start?.date ?? item.start?.dateTime ?? '').slice(0, 10),
    endDate: (item.end?.date ?? item.end?.dateTime ?? '').slice(0, 10),
  })).filter((e: GoogleEvent) => e.date)
}

export default async function CalendarPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const adminClient = createAdminClient()
  const [{ data: events }, { data: anniversaries }] = await Promise.all([
    adminClient.from('events').select('*').order('date'),
    adminClient.from('anniversaries').select('*'),
  ])

  const googleEvents: GoogleEvent[] = session?.provider_token
    ? await fetchGoogleCalendarEvents(session.provider_token)
    : []

  return (
    <main className="min-h-screen px-3 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f0f2ff' }}>カレンダー</h1>
            <p className="text-sm" style={{ color: '#4b5563' }}>二人の予定</p>
          </div>
          {googleEvents.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
              Google連携中 {googleEvents.length}件
            </span>
          )}
        </div>
        <CalendarView
          events={(events ?? []) as CalendarEvent[]}
          anniversaries={(anniversaries ?? []) as Anniversary[]}
          googleEvents={googleEvents}
        />
      </div>
    </main>
  )
}
