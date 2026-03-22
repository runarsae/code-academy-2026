import { describe, it, expect } from "vitest";
import { demoIdems } from "@/lib/demo-data";

describe("demoIdems", () => {
  it("contains exactly 200 idems per FR-007", () => {
    expect(demoIdems).toHaveLength(200);
  });

  it("contains unique IDs for all idems", () => {
    const ids = demoIdems.map((idem) => idem.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(200);
  });

  it("contains at least 10 unique authors per FR-008", () => {
    const authors = new Set(demoIdems.map((idem) => idem.author));
    expect(authors.size).toBeGreaterThanOrEqual(10);
  });

  it("is sorted by createdAt descending (newest first) per FR-011", () => {
    for (let i = 1; i < demoIdems.length; i++) {
      const prevDate = new Date(demoIdems[i - 1].createdAt).getTime();
      const currDate = new Date(demoIdems[i].createdAt).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  it("contains varied content lengths per FR-009", () => {
    const short = demoIdems.filter((i) => i.content.length < 100);
    const medium = demoIdems.filter(
      (i) => i.content.length >= 100 && i.content.length <= 200
    );
    const long = demoIdems.filter((i) => i.content.length > 200);

    // Approximate distributions: ~30% short, ~50% medium, ~20% long
    expect(short.length).toBeGreaterThan(20);
    expect(medium.length).toBeGreaterThan(50);
    expect(long.length).toBeGreaterThan(10);
  });

  it("contains timestamps spanning a 7-day range per FR-010", () => {
    const timestamps = demoIdems.map((i) => new Date(i.createdAt).getTime());
    const oldest = Math.min(...timestamps);
    const newest = Math.max(...timestamps);
    const daysDiff = (newest - oldest) / (1000 * 60 * 60 * 24);
    expect(daysDiff).toBeGreaterThanOrEqual(1);
    expect(daysDiff).toBeLessThanOrEqual(7);
  });

  it("all idems have required fields", () => {
    for (const idem of demoIdems) {
      expect(idem.id).toBeDefined();
      expect(idem.author).toBeDefined();
      expect(idem.content).toBeDefined();
      expect(idem.createdAt).toBeDefined();
    }
  });

  it("all idems have valid content length (max 280 chars)", () => {
    for (const idem of demoIdems) {
      expect(idem.content.length).toBeLessThanOrEqual(280);
      expect(idem.content.length).toBeGreaterThan(0);
    }
  });

  it("all idems have valid author length (max 50 chars)", () => {
    for (const idem of demoIdems) {
      expect(idem.author.length).toBeLessThanOrEqual(50);
      expect(idem.author.length).toBeGreaterThan(0);
    }
  });
});
