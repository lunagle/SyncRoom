import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './LoginButton'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 font-sans"
      style={{ background: '#050810', color: '#f0f2ff' }}>
      <div className="w-full max-w-sm text-center">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#f0f2ff' }}>SyncRoom</h1>
          <p className="text-sm" style={{ color: '#4b5563' }}>ふたりの今と奇跡を繋ぐ、デジタルルーム</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Googleアカウントでログイン</p>
          <LoginButton />
        </div>
      </div>
    </main>
  )
}
