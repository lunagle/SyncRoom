export function SkeletonCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6"
      style={{ background: 'rgba(8,12,24,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="absolute left-0 top-0 h-full w-0.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="pl-2 space-y-3 animate-pulse">
        <div className="h-4 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-4 w-32 rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-3 w-24 rounded-md" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-12 w-28 rounded-md mt-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border px-5 py-4 animate-pulse"
      style={{ background: 'rgba(8,12,24,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="h-11 w-11 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="h-3 w-20 rounded-md" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="h-5 w-14 rounded-md" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </div>
  )
}
