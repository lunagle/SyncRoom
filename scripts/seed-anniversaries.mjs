import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const seeds = [
  { title: '付き合った日', date: '2024-12-25', type: 'past' },
  { title: '初めて会った日', date: '2024-10-14', type: 'past' },
  { title: '初めて手を繋いだ日', date: '2024-11-03', type: 'past' },
  { title: '次の誕生日', date: '2026-08-13', type: 'future' },
  { title: '夏の旅行', date: '2026-07-20', type: 'future' },
]

const { data, error } = await supabase.from('anniversaries').insert(seeds).select()

if (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

console.log(`✓ ${data.length}件挿入しました`)
data.forEach((d) => console.log(`  - ${d.title} (${d.date})`))
