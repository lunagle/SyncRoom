import { createAdminClient } from '@/utils/supabase/admin'
import TodoList from '@/components/TodoList'

export const revalidate = 0

export type Todo = {
  id: string
  title: string
  completed: boolean
  category: string
  created_at: string
}

export default async function TodoPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen px-4 py-8 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #34d399, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            やることリスト
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>二人のToDo</p>
        </div>
        <TodoList items={(data ?? []) as Todo[]} />
      </div>
    </main>
  )
}
