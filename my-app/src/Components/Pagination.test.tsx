import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders all pages when total fits", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: String(i) })).toBeInTheDocument();
    }
  });

  it("marks the current page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("calls onPageChange with clicked page", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "4" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("prev disabled on first page", () => {
    render(<Pagination page={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("next disabled on last page", () => {
    render(<Pagination page={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("prev/next call onPageChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(onChange).toHaveBeenCalledWith(4);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("renders ellipsis when pages overflow", () => {
    render(<Pagination page={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination page={5} totalPages={10} onPageChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});