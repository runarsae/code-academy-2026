import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a spinning element", () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("has proper styling classes", () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toHaveClass("rounded-full");
  });

  it("is centered in its container", () => {
    render(<LoadingSpinner />);
    const container = document.querySelector(".flex.justify-center.items-center");
    expect(container).toBeInTheDocument();
  });

  it("has appropriate size", () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toHaveClass("h-10", "w-10");
  });
});
