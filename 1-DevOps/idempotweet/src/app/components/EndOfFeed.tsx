interface EndOfFeedProps {
  totalCount?: number;
}

export function EndOfFeed({ totalCount }: EndOfFeedProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <p className="text-slate-600 font-medium">
        You&apos;ve reached the end!
      </p>
      {totalCount !== undefined && (
        <p className="text-sm text-slate-400 mt-1">
          {totalCount} idems loaded
        </p>
      )}
    </div>
  );
}
