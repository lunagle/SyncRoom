import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const cookieStore = await cookies()
  const hasSession = cookieStore.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )
  if (!hasSession) redirect('/login')
}
