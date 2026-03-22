import { describe, it, expect } from "vitest";
import { generateDemoIdems } from "@/lib/generate-demo-data";

describe("generateDemoIdems", () => {
  it("generates the requested number of idems", () => {
    const idems = generateDemoIdems(50);
    expect(idems).toHaveLength(50);
  });

  it("generates 200 idems by default", () => {
    const idems = generateDemoIdems();
    expect(idems).toHaveLength(200);
  });

  it("generates idems with unique IDs", () => {
    const idems = generateDemoIdems(200);
    const ids = idems.map((idem) => idem.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(200);
  });

  it("generates idems with at least 10 unique authors", () => {
    const idems = generateDemoIdems(200);
    const authors = new Set(idems.map((idem) => idem.author));
    expect(authors.size).toBeGreaterThanOrEqual(10);
  });

  it("generates idems sorted by createdAt descending (newest first)", () => {
    const idems = generateDemoIdems(200);
    for (let i = 1; i < idems.length; i++) {
      const prevDate = new Date(idems[i - 1].createdAt).getTime();
      const currDate = new Date(idems[i].createdAt).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  it("generates idems with varied content lengths", () => {
    const idems = generateDemoIdems(200);
    const short = idems.filter((i) => i.content.length < 100);
    const medium = idems.filter(
      (i) => i.content.length >= 100 && i.content.length <= 200
    );
    const long = idems.filter((i) => i.content.length > 200);

    expect(short.length).toBeGreaterThan(0);
    expect(medium.length).toBeGreaterThan(0);
    expect(long.length).toBeGreaterThan(0);
  });

  it("generates deterministic output with the same seed", () => {
    const idems1 = generateDemoIdems(10, 123);
    const idems2 = generateDemoIdems(10, 123);
    expect(idems1).toEqual(idems2);
  });

  it("generates different output with different seeds", () => {
    const idems1 = generateDemoIdems(10, 123);
    const idems2 = generateDemoIdems(10, 456);
    expect(idems1).not.toEqual(idems2);
  });

  it("generates idems with timestamps spanning a 7-day range", () => {
    const idems = generateDemoIdems(200);
    const timestamps = idems.map((i) => new Date(i.createdAt).getTime());
    const oldest = Math.min(...timestamps);
    const newest = Math.max(...timestamps);
    const daysDiff = (newest - oldest) / (1000 * 60 * 60 * 24);
    expect(daysDiff).toBeGreaterThanOrEqual(1);
    expect(daysDiff).toBeLessThanOrEqual(7);
  });

  it("generates idems with content under 280 characters", () => {
    const idems = generateDemoIdems(200);
    for (const idem of idems) {
      expect(idem.content.length).toBeLessThanOrEqual(280);
    }
  });

  it("generates idems with non-empty author names", () => {
    const idems = generateDemoIdems(200);
    for (const idem of idems) {
      expect(idem.author.length).toBeGreaterThan(0);
      expect(idem.author.length).toBeLessThanOrEqual(50);
    }
  });

  it("generates idems with valid ISO 8601 dates", () => {
    const idems = generateDemoIdems(200);
    for (const idem of idems) {
      const date = new Date(idem.createdAt);
      expect(date.toISOString()).toBe(idem.createdAt);
    }
  });
});
