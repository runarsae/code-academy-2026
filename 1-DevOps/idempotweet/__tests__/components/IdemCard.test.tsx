import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IdemCard } from "@/app/components/IdemCard";
import type { Idem } from "@/types/idem";

const mockIdem: Idem = {
  id: "idem-001",
  author: "Test Author",
  content: "This is test content for the idem card component.",
  createdAt: "2025-12-19T10:00:00Z",
};

describe("IdemCard", () => {
  it("renders the idem content", () => {
    render(<IdemCard idem={mockIdem} />);
    expect(screen.getByText(mockIdem.content)).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<IdemCard idem={mockIdem} />);
    expect(screen.getByText(mockIdem.author)).toBeInTheDocument();
  });

  it("renders as an article element", () => {
    render(<IdemCard idem={mockIdem} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders a time element with datetime attribute", () => {
    render(<IdemCard idem={mockIdem} />);
    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveAttribute("dateTime", mockIdem.createdAt);
  });

  it("displays relative time", () => {
    render(<IdemCard idem={mockIdem} />);
    const timeElement = screen.getByRole("time");
    // Should contain "ago" from formatDistanceToNow
    expect(timeElement.textContent).toContain("ago");
  });

  it("renders long content without truncation", () => {
    const longContent =
      "This is a very long piece of content that should be displayed in full. ".repeat(
        3
      ).trim();
    const idemWithLongContent: Idem = {
      ...mockIdem,
      content: longContent.slice(0, 280),
    };
    render(<IdemCard idem={idemWithLongContent} />);
    expect(
      screen.getByText(idemWithLongContent.content)
    ).toBeInTheDocument();
  });

  it("has proper semantic structure with header", () => {
    render(<IdemCard idem={mockIdem} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    // Header contains author and time
    expect(screen.getByText(mockIdem.author).closest("header")).toBeInTheDocument();
  });
});
