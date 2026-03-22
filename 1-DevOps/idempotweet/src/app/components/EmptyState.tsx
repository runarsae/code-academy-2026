export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-slate-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">📝</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">No idems yet</h2>
      <p className="text-slate-500 text-center max-w-sm leading-relaxed">
        Be the first to share an idempotent thought!
      </p>
    </div>
  );
}
