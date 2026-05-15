import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <div className="pb-20">{children}</div>
      <BottomNav />
    </>
  )
}
