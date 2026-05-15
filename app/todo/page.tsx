import { createAdminClient } from '@/utils/supabase/admin'
import TodoList from '@/components/TodoList'

export const revalidate = 0

export type Todo = {
  id: string
  title: string
  completed: boolean
  category: string
  assignee: string
  created_at: string
}

export default async function TodoPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <main className="min-h-screen px-4 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2ff' }}>やることリスト</h1>
          <p className="text-sm" style={{ color: '#4b5563' }}>二人のToDo</p>
        </div>
        <TodoList items={(data ?? []) as Todo[]} />
      </div>
    </main>
  )
}
