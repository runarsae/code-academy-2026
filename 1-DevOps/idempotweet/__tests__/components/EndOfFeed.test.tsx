import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EndOfFeed } from "@/app/components/EndOfFeed";

describe("EndOfFeed", () => {
  it("renders the end of feed message", () => {
    render(<EndOfFeed />);
    expect(screen.getByText(/you.*ve reached the end/i)).toBeInTheDocument();
  });

  it("renders with appropriate ARIA role", () => {
    render(<EndOfFeed />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays the total count when provided", () => {
    render(<EndOfFeed totalCount={200} />);
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });

  it("renders without total count", () => {
    render(<EndOfFeed />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
