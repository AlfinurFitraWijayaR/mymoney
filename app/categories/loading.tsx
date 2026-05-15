export default function CategoriesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="section-header">
        <div>
          <div className="h-7 w-28 bg-zinc-200 rounded mb-2" />
          <div className="h-3 w-44 bg-zinc-200 rounded" />
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-zinc-100 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-zinc-200 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-20 bg-zinc-200 rounded" />
              <div className="h-2.5 w-14 bg-zinc-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
