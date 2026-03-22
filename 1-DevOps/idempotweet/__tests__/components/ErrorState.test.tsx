import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/app/components/ErrorState";

describe("ErrorState", () => {
  it("renders the error message", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });

  it("renders a retry button", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders an emoji decoration", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it("has proper heading hierarchy", () => {
    render(<ErrorState onRetry={() => {}} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Failed to load/i);
  });

  it("renders a helpful description", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
