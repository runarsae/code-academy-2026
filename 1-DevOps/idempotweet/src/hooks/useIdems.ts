import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginatedIdems } from "@/types/idem";

async function fetchIdems(page: number, includeSeeded: boolean): Promise<PaginatedIdems> {
  const response = await fetch(`/api/idems?page=${page}&include_seeded=${includeSeeded}`);
  if (!response.ok) {
    throw new Error("Failed to fetch idems");
  }
  return response.json();
}

export function useIdems(includeSeeded: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["idems", { includeSeeded }],
    queryFn: ({ pageParam }) => fetchIdems(pageParam, includeSeeded),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
