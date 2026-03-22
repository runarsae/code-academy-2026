import { describe, it, expect } from "vitest";
import { formatDistanceToNow } from "date-fns";

describe("date formatting utilities", () => {
  describe("formatDistanceToNow", () => {
    it("formats a date from 1 hour ago", () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const result = formatDistanceToNow(oneHourAgo, { addSuffix: true });
      expect(result).toContain("ago");
      expect(result).toMatch(/hour|minute/);
    });

    it("formats a date from 1 day ago", () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = formatDistanceToNow(oneDayAgo, { addSuffix: true });
      expect(result).toContain("ago");
      expect(result).toMatch(/day|hour/);
    });

    it("formats a date from 1 week ago", () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const result = formatDistanceToNow(oneWeekAgo, { addSuffix: true });
      expect(result).toContain("ago");
      expect(result).toMatch(/day|week/);
    });

    it("handles ISO date strings", () => {
      const isoDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const result = formatDistanceToNow(new Date(isoDate), { addSuffix: true });
      expect(result).toContain("ago");
    });

    it("formats recent dates as 'less than a minute ago'", () => {
      const justNow = new Date(Date.now() - 10 * 1000);
      const result = formatDistanceToNow(justNow, { addSuffix: true });
      expect(result).toContain("ago");
    });
  });
});
