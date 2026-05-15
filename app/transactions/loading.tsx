export default function TransactionsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-24 bg-zinc-200 rounded" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-200 rounded-full" />
          <div className="w-8 h-8 bg-zinc-200 rounded-full" />
        </div>
      </div>

      {/* Transaction groups */}
      {[1, 2].map((group) => (
        <div key={group} className="mb-3">
          <div className="flex items-center justify-between bg-white px-4 py-2.5 w-full">
            <div className="h-3 w-40 bg-zinc-200 rounded" />
            <div className="h-3 w-20 bg-zinc-200 rounded" />
          </div>
          <div className="space-y-3 px-3 mt-3">
            {[1, 2, 3].map((tx) => (
              <div
                key={tx}
                className="bg-white rounded-xl p-4 flex items-center justify-between border border-zinc-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-zinc-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-20 bg-zinc-200 rounded" />
                    <div className="h-2.5 w-32 bg-zinc-200 rounded" />
                    <div className="h-2 w-16 bg-zinc-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-24 bg-zinc-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
