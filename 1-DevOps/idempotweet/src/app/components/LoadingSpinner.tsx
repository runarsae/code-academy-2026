export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-500" />
        <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-4 border-indigo-500 opacity-20" />
      </div>
    </div>
  );
}
