export default function Loading() {
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
        <div className="flex flex-col gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-11 rounded-xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      </div>
    </main>
  )
}
