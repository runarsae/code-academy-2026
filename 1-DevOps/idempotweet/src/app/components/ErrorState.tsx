interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-red-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        Failed to load idems
      </h2>
      <p className="text-slate-500 text-center max-w-sm mb-6 leading-relaxed">
        Something went wrong. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm hover:shadow"
      >
        Retry
      </button>
    </div>
  );
}
