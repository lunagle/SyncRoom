'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string
  const category = (formData.get('category') as string) || 'general'
  if (!title?.trim()) return
  const supabase = createAdminClient()
  await supabase.from('todos').insert({ title: title.trim(), category })
  revalidatePath('/todo')
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = createAdminClient()
  await supabase.from('todos').update({ completed }).eq('id', id)
  revalidatePath('/todo')
}

export async function deleteTodo(id: string) {
  const supabase = createAdminClient()
  await supabase.from('todos').delete().eq('id', id)
  revalidatePath('/todo')
}

export async function addAnniversary(formData: FormData) {
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'past' | 'future'
  const recurring_period = (formData.get('recurring_period') as string) || 'none'

  if (!title?.trim() || !date || !type) return

  const supabase = createAdminClient()
  await supabase.from('anniversaries').insert({
    title: title.trim(), date, type, recurring_period, recurring: recurring_period !== 'none',
  })
  revalidatePath('/')
  revalidatePath('/countdown')
  revalidatePath('/memories')
  revalidatePath('/recurring')
}

export async function deleteAnniversary(id: string) {
  const supabase = createAdminClient()
  await supabase.from('anniversaries').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/countdown')
  revalidatePath('/memories')
  revalidatePath('/recurring')
}

export async function updateAnniversary(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'past' | 'future'
  const recurring_period = (formData.get('recurring_period') as string) || 'none'

  if (!title?.trim() || !date || !type) return

  const supabase = createAdminClient()
  await supabase.from('anniversaries').update({
    title: title.trim(), date, type, recurring_period, recurring: recurring_period !== 'none',
  }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/countdown')
  revalidatePath('/memories')
  revalidatePath('/recurring')
}
