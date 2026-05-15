import { requireAuth } from '@/utils/auth'

export default async function MorePage() {
  await requireAuth()
  const items = [
    { label: 'プロフィール', icon: '👤', desc: '二人のプロフィール', soon: true },
    { label: 'したいことリスト', icon: '🌟', desc: '行きたい場所・やりたいこと', soon: true },
    { label: 'デートガチャ', icon: '🎲', desc: 'ランダムデートプラン提案', soon: true },
    { label: '思い出マップ', icon: '🗺️', desc: '二人の思い出スポット', soon: true },
    { label: '歴史書', icon: '📖', desc: '二人の年表', soon: true },
  ]

  return (
    <main className="min-h-screen px-4 py-6 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2ff' }}>その他</h1>
          <p className="text-sm" style={{ color: '#4b5563' }}>追加機能</p>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.label}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.6 }}>
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{item.label}</p>
                <p className="text-xs" style={{ color: '#4b5563' }}>{item.desc}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#4b5563' }}>近日公開</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
