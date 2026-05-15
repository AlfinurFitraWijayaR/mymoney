export default function DashboardLoading() {
  return (
    <div className="-m-4 md:-m-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-primary-600/80 text-white pt-4 pb-16 px-6 rounded-b-[1.5rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full" />
            <div className="h-4 w-32 bg-white/20 rounded-lg" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20" />
        </div>
        <div className="h-4 w-40 bg-white/20 rounded-lg mb-4" />
        <div className="h-10 w-64 bg-white/20 rounded-lg mb-6" />
        <div className="grid grid-cols-2 gap-4 mt-14">
          <div className="bg-white/10 p-4 rounded-3xl h-16" />
          <div className="bg-white/10 p-4 rounded-3xl h-16" />
        </div>
      </div>

      {/* Quote Skeleton */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-4 border border-zinc-100/50">
          <div className="flex gap-4 items-center">
            <div className="w-7 h-7 bg-zinc-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-zinc-200 rounded" />
              <div className="h-3 w-3/4 bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div className="px-6 py-8 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 bg-zinc-200 rounded" />
          <div className="w-5 h-5 bg-zinc-200 rounded-full" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-zinc-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-zinc-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-200 rounded" />
                <div className="h-2.5 w-16 bg-zinc-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
