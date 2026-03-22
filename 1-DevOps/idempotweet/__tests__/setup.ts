import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { Idem } from "@/types/idem";

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin: string = "";
  thresholds: ReadonlyArray<number> = [];

  constructor(
    private callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}

  observe(_target: Element): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// Mock data for tests
export const mockIdems: Idem[] = [
  {
    id: "idem-001",
    author: "Test Author 1",
    content: "Test content for idem 1",
    createdAt: "2025-12-19T10:00:00Z",
  },
  {
    id: "idem-002",
    author: "Test Author 2",
    content: "Test content for idem 2",
    createdAt: "2025-12-19T09:00:00Z",
  },
];

// Generate paginated mock data
export function generateMockPaginatedResponse(page: number, pageSize: number = 20, totalCount: number = 200) {
  const items: Idem[] = [];
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  for (let i = startIndex; i < endIndex; i++) {
    items.push({
      id: `idem-${String(totalCount - i).padStart(3, "0")}`,
      author: `Author ${(i % 10) + 1}`,
      content: `Content for idem ${totalCount - i}`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    });
  }

  return {
    items,
    page,
    pageSize,
    totalCount,
    hasMore: endIndex < totalCount,
    nextPage: endIndex < totalCount ? page + 1 : null,
  };
}

// MSW handlers
export const handlers = [
  http.get("/api/idems", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);

    return HttpResponse.json(generateMockPaginatedResponse(page, pageSize));
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
