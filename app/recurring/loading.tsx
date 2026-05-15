import { SkeletonRow } from '@/components/SkeletonCard'

export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-12 font-sans" style={{ color: '#f0f2ff' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="mb-1 text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            繰り返し記念日
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>毎年・毎月の大切な日</p>
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </main>
  )
}
