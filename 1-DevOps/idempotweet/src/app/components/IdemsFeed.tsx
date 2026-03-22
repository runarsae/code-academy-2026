"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useIdems } from "@/hooks/useIdems";
import { IdemCard } from "./IdemCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { EndOfFeed } from "./EndOfFeed";

interface IdemsFeedProps {
  includeSeeded?: boolean;
}

export function IdemsFeed({ includeSeeded = true }: IdemsFeedProps) {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIdems(includeSeeded);

  const prevCountRef = useRef(0);

  // Intersection observer for infinite scroll with 200px threshold per FR-002
  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  // Trigger fetch when sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const allIdems = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const demoMode = data?.pages[0]?.demoMode ?? false;

  // Track new items for animation
  const newItemsStartIndex = prevCountRef.current;
  prevCountRef.current = allIdems.length;

  if (allIdems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-5">
      {demoMode && (
        <div className="rounded-lg border border-amber-400 bg-amber-950 px-4 py-3 text-sm text-amber-100">
          <strong>Demo-modus:</strong> Ingen database tilkoblet. Viser generert demodata.
        </div>
      )}
      {allIdems.map((idem, index) => (
        <div
          key={idem.id}
          className={index >= newItemsStartIndex ? "animate-fade-in" : ""}
          style={{
            animationDelay: index >= newItemsStartIndex ? `${(index - newItemsStartIndex) * 50}ms` : "0ms",
          }}
        >
          <IdemCard idem={idem} />
        </div>
      ))}

      {/* Scroll sentinel for infinite scroll */}
      <div ref={ref} data-testid="scroll-sentinel" className="h-1" />

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {/* End of feed indicator */}
      {!hasNextPage && allIdems.length > 0 && (
        <EndOfFeed totalCount={totalCount} />
      )}
    </div>
  );
}
