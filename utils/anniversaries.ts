export type Anniversary = {
  id: string
  title: string
  date: string
  type: 'past' | 'future'
  created_at: string
}

export type DisplayMode = 'days' | 'hours' | 'breakdown'

export const DISPLAY_MODES: DisplayMode[] = ['days', 'hours', 'breakdown']

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

  let from = type === 'past' ? target : today
  let to = type === 'past' ? today : target

  if (to < from) return { years: 0, months: 0, days: 0 }

  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()

  if (days < 0) {
    months--
    const prev = new Date(to.getFullYear(), to.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const MODE_LABELS: Record<DisplayMode, string> = {
  days: '日',
  hours: '時間',
  breakdown: '年月日',
}

export function getAutoMode(date: string, type: 'past' | 'future'): DisplayMode {
  const days = calculateDays(date, type)
  if (days < 3) return 'hours'
  if (days < 60) return 'days'
  return 'breakdown'
}
