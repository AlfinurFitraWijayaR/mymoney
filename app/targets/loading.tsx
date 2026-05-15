export default function TargetsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-7 w-36 bg-zinc-200 rounded mb-2" />
          <div className="h-3 w-48 bg-zinc-200 rounded" />
        </div>
        <div className="w-8 h-8 bg-zinc-200 rounded-full" />
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-zinc-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-zinc-200 rounded" />
                <div className="h-3 w-20 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-zinc-200 rounded" />
              <div className="h-3 w-24 bg-zinc-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
