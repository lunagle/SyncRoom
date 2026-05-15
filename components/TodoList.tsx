'use client'

import { useState, useTransition } from 'react'
import { addTodo, toggleTodo, deleteTodo } from '@/app/actions'
import { Todo } from '@/app/todo/page'

const CATEGORIES = [
  { value: 'general', label: 'その他', color: '#a78bfa' },
  { value: 'shopping', label: '買い物', color: '#34d399' },
  { value: 'travel', label: '旅行', color: '#60a5fa' },
  { value: 'date', label: 'デート', color: '#f472b6' },
]

function getCat(value: string) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0]
}

export default function TodoList({ items }: { items: Todo[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [category, setCategory] = useState('general')
  const [isPending, startTransition] = useTransition()

  const filtered = filter === 'all'
    ? items
    : filter === 'done'
    ? items.filter((t) => t.completed)
    : items.filter((t) => t.category === filter && !t.completed)

  const remaining = items.filter((t) => !t.completed).length

  function handleAdd(formData: FormData) {
    formData.set('category', category)
    startTransition(async () => { await addTodo(formData) })
  }

  return (
    <div>
      {/* 入力欄 */}
      <form action={handleAdd} className="mb-6">
        <div className="flex gap-2 mb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className="flex-1 rounded-full py-1.5 text-xs font-medium transition-all"
              style={{
                background: category === c.value ? `${c.color}22` : 'rgba(255,255,255,0.04)',
                color: category === c.value ? c.color : '#4b5563',
                border: `1px solid ${category === c.value ? c.color : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            name="title"
            type="text"
            required
            placeholder="やること追加…"
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f2ff' }}
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl px-4 py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #34d399, #a78bfa)', color: '#fff' }}
          >
            追加
          </button>
        </div>
      </form>

      {/* フィルター */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {[
            { value: 'all', label: 'すべて' },
            ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            { value: 'done', label: '完了済み' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="rounded-full px-2.5 py-0.5 text-xs transition-all"
              style={{
                background: filter === f.value ? 'rgba(167,139,250,0.15)' : 'transparent',
                color: filter === f.value ? '#a78bfa' : '#4b5563',
                border: `1px solid ${filter === f.value ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs" style={{ color: '#4b5563' }}>{remaining}件残り</span>
      </div>

      {/* リスト */}
      <div className="flex flex-col gap-1.5">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#374151' }}>
            {filter === 'done' ? '完了済みなし' : 'やることなし'}
          </div>
        )}
        {filtered.map((todo) => {
          const cat = getCat(todo.category)
          return (
            <div
              key={todo.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: todo.completed ? 0.5 : 1,
              }}
            >
              {/* チェックボックス */}
              <button
                onClick={() => startTransition(async () => { await toggleTodo(todo.id, !todo.completed) })}
                className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: todo.completed ? cat.color : 'rgba(255,255,255,0.15)',
                  background: todo.completed ? `${cat.color}33` : 'transparent',
                }}
              >
                {todo.completed && <span style={{ color: cat.color, fontSize: '10px' }}>✓</span>}
              </button>

              {/* テキスト */}
              <span
                className="flex-1 text-sm"
                style={{
                  color: todo.completed ? '#4b5563' : '#e5e7eb',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.title}
              </span>

              {/* カテゴリバッジ */}
              <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: `${cat.color}18`, color: cat.color, fontSize: '10px' }}>
                {cat.label}
              </span>

              {/* 削除 */}
              <button
                onClick={() => startTransition(async () => { await deleteTodo(todo.id) })}
                className="shrink-0 text-xs"
                style={{ color: '#374151' }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
