'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addAnniversary(formData: FormData) {
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'past' | 'future'

  if (!title?.trim() || !date || !type) return

  const supabase = createAdminClient()
  await supabase.from('anniversaries').insert({ title: title.trim(), date, type })
  revalidatePath('/')
}

export async function deleteAnniversary(id: string) {
  const supabase = createAdminClient()
  await supabase.from('anniversaries').delete().eq('id', id)
  revalidatePath('/')
}

export async function updateAnniversary(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const type = formData.get('type') as 'past' | 'future'

  if (!title?.trim() || !date || !type) return

  const supabase = createAdminClient()
  await supabase.from('anniversaries').update({ title: title.trim(), date, type }).eq('id', id)
  revalidatePath('/')
}
