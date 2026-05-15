export type RecurringPeriod = 'none' | 'yearly' | 'monthly'

export type Anniversary = {
  id: string
  title: string
  date: string
  type: 'past' | 'future'
  recurring: boolean
  recurring_period: RecurringPeriod
  created_at: string
}

export type DisplayMode = 'days' | 'hours' | 'breakdown'
export type SortOrder = 'near' | 'far' | 'added'

export const DISPLAY_MODES: DisplayMode[] = ['days', 'hours', 'breakdown']

function toLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getEffectiveDate(item: Anniversary): string {
  if (item.recurring_period === 'none' && !item.recurring) return item.date

  const original = new Date(item.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const period = item.recurring_period !== 'none' ? item.recurring_period : 'yearly'

  if (period === 'monthly') {
    const day = original.getDate()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), day)
    if (thisMonth >= today) return toLocalDate(thisMonth)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day)
    return toLocalDate(nextMonth)
  }

  // yearly
  const thisYear = new Date(today.getFullYear(), original.getMonth(), original.getDate())
  if (thisYear >= today) return toLocalDate(thisYear)
  const nextYear = new Date(today.getFullYear() + 1, original.getMonth(), original.getDate())
  return toLocalDate(nextYear)
}

function diffMs(date: string, type: 'past' | 'future'): number {
  const target = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return type === 'past'
    ? today.getTime() - target.getTime()
    : target.getTime() - today.getTime()
}

export function calculateDays(date: string, type: 'past' | 'future'): number {
  return Math.floor(diffMs(date, type) / 86400000)
}

export function calculateHours(date: string, type: 'past' | 'future'): number {
  const target = new Date(date)
  const now = new Date()
  const diff = type === 'past'
    ? now.getTime() - target.getTime()
    : target.getTime() - now.getTime()
  return Math.floor(diff / 3600000)
}

export function calculateBreakdown(
  date: string,
  type: 'past' | 'future'
): { years: number; months: number; days: number } {
  const target = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const from = type === 'past' ? target : today
  const to = type === 'past' ? today : target

  if (to < from) return { years: 0, months: 0, days: 0 }

  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()

  if (days < 0) {
    months--
    const prev = new Date(to.getFullYear(), to.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) { years--; months += 12 }

  return { years, months, days }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatMonthDay(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
}

export function formatDay(date: string): string {
  return `${new Date(date).getDate()}日`
}

export const MODE_LABELS: Record<DisplayMode, string> = {
  days: '日', hours: '時間', breakdown: '年月日',
}

export function getAutoMode(date: string, type: 'past' | 'future'): DisplayMode {
  const days = calculateDays(date, type)
  if (days < 3) return 'hours'
  if (days < 60) return 'days'
  return 'breakdown'
}

export function sortAnniversaries(items: Anniversary[], order: SortOrder): Anniversary[] {
  return [...items].sort((a, b) => {
    if (order === 'added') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    const daysA = calculateDays(getEffectiveDate(a), a.type)
    const daysB = calculateDays(getEffectiveDate(b), b.type)
    return order === 'near' ? daysA - daysB : daysB - daysA
  })
}
