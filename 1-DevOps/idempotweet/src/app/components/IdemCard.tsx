import { formatDistanceToNow } from "date-fns";
import type { Idem } from "@/types/idem";

interface IdemCardProps {
  idem: Idem;
}

export function IdemCard({ idem }: IdemCardProps) {
  const relativeTime = formatDistanceToNow(new Date(idem.createdAt), {
    addSuffix: true,
  });

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <header className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {idem.author}
        </span>
        <time
          className="text-xs text-slate-500 font-medium"
          dateTime={idem.createdAt}
        >
          {relativeTime}
        </time>
      </header>
      <p className="text-base text-slate-700 leading-relaxed">{idem.content}</p>
    </article>
  );
}
