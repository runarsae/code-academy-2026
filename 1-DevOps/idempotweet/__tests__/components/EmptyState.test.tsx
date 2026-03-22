import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/app/components/EmptyState";

describe("EmptyState", () => {
  it("renders the empty state message", () => {
    render(<EmptyState />);
    expect(screen.getByText(/No idems yet/i)).toBeInTheDocument();
  });

  it("renders a descriptive message", () => {
    render(<EmptyState />);
    expect(screen.getByText(/first to share/i)).toBeInTheDocument();
  });

  it("renders an emoji decoration", () => {
    render(<EmptyState />);
    expect(screen.getByText("📝")).toBeInTheDocument();
  });

  it("has proper heading hierarchy", () => {
    render(<EmptyState />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/No idems yet/i);
  });

  it("is centered in layout", () => {
    const { container } = render(<EmptyState />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex", "flex-col", "items-center", "justify-center");
  });
});
