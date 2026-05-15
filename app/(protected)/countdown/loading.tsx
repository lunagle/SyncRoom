import { SkeletonCard } from '@/components/SkeletonCard'

export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-12 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            カウントダウン
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>〇〇までの日数</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </main>
  )
}
