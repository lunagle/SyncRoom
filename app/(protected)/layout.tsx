import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const hasSession = cookieStore.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

  if (!hasSession) redirect('/login')

  return (
    <>
      <div className="pb-20">{children}</div>
      <BottomNav />
    </>
  )
}
