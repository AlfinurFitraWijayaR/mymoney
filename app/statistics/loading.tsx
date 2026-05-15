export default function StatisticsLoading() {
  return (
    <div className="-m-4 md:-m-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-primary-600/80 text-white pt-4 pb-16 px-6 rounded-b-[1.5rem]">
        <div className="flex flex-col gap-8 mb-2">
          <div className="flex items-center justify-between w-full mt-2">
            <div>
              <div className="h-7 w-24 bg-white/20 rounded mb-2" />
              <div className="h-3 w-48 bg-white/20 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="h-4 w-32 bg-white/20 rounded" />
            <div className="w-10 h-10 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="px-6 -mt-10 relative z-20 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 max-w-lg mx-auto">
          <div className="h-4 w-24 bg-zinc-200 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-20 bg-zinc-200 rounded" />
                <div className="h-3 w-28 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Skeletons */}
      <div className="space-y-6 px-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-100">
          <div className="h-4 w-40 bg-zinc-200 rounded mb-6" />
          <div className="h-64 w-full bg-zinc-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-zinc-100">
            <div className="h-4 w-48 bg-zinc-200 rounded mb-6" />
            <div className="h-48 w-full bg-zinc-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-xl p-6 border border-zinc-100">
            <div className="h-4 w-44 bg-zinc-200 rounded mb-6" />
            <div className="h-48 w-full bg-zinc-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
