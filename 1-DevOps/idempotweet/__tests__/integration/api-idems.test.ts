import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup";
import type { PaginatedIdems } from "@/types/idem";
import { demoIdems } from "@/lib/demo-data";

const DEFAULT_PAGE_SIZE = 20;

function createPaginatedResponse(page: number, pageSize: number): PaginatedIdems {
  const totalCount = demoIdems.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const items = demoIdems.slice(startIndex, endIndex);
  const hasMore = endIndex < totalCount;

  return {
    items,
    page,
    pageSize,
    totalCount,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}

describe("GET /api/idems", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/idems", ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const pageSize = parseInt(url.searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10);

        if (page < 1 || isNaN(page)) {
          return HttpResponse.json(
            { error: "Invalid page number", message: "Page must be a positive integer" },
            { status: 400 }
          );
        }

        if (pageSize < 1 || pageSize > 100 || isNaN(pageSize)) {
          return HttpResponse.json(
            { error: "Invalid page size", message: "Page size must be between 1 and 100" },
            { status: 400 }
          );
        }

        return HttpResponse.json(createPaginatedResponse(page, pageSize));
      })
    );
  });

  it("returns first page of 20 idems by default", async () => {
    const response = await fetch("/api/idems");
    const data: PaginatedIdems = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(20);
    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(20);
    expect(data.totalCount).toBe(200);
    expect(data.hasMore).toBe(true);
    expect(data.nextPage).toBe(2);
  });

  it("returns specified page", async () => {
    const response = await fetch("/api/idems?page=3");
    const data: PaginatedIdems = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(3);
    expect(data.items).toHaveLength(20);
    expect(data.hasMore).toBe(true);
    expect(data.nextPage).toBe(4);
  });

  it("returns last page with hasMore=false", async () => {
    const response = await fetch("/api/idems?page=10");
    const data: PaginatedIdems = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(10);
    expect(data.items).toHaveLength(20);
    expect(data.hasMore).toBe(false);
    expect(data.nextPage).toBeNull();
  });

  it("returns empty items for page beyond data", async () => {
    const response = await fetch("/api/idems?page=100");
    const data: PaginatedIdems = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(0);
    expect(data.hasMore).toBe(false);
    expect(data.nextPage).toBeNull();
  });

  it("supports custom page size", async () => {
    const response = await fetch("/api/idems?page=1&pageSize=10");
    const data: PaginatedIdems = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(10);
    expect(data.pageSize).toBe(10);
    expect(data.totalCount).toBe(200);
    expect(data.hasMore).toBe(true);
    expect(data.nextPage).toBe(2);
  });

  it("returns 400 for invalid page number", async () => {
    const response = await fetch("/api/idems?page=-1");
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Invalid page number");
  });

  it("returns 400 for invalid page size", async () => {
    const response = await fetch("/api/idems?pageSize=101");
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Invalid page size");
  });

  it("returns idems sorted newest first", async () => {
    const response = await fetch("/api/idems?page=1");
    const data: PaginatedIdems = await response.json();

    for (let i = 1; i < data.items.length; i++) {
      const prevDate = new Date(data.items[i - 1].createdAt).getTime();
      const currDate = new Date(data.items[i].createdAt).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  it("returns all 200 idems across 10 pages", async () => {
    const allIds = new Set<string>();

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(`/api/idems?page=${page}`);
      const data: PaginatedIdems = await response.json();

      for (const idem of data.items) {
        allIds.add(idem.id);
      }
    }

    expect(allIds.size).toBe(200);
  });
});
