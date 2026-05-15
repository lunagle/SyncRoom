import { redirect } from 'next/navigation'
export type Todo = {
  id: string
  title: string
  completed: boolean
  category: string
  created_at: string
}
export default function TodoPage() { redirect('/') }
