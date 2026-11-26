import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("associates label", () => {
    render(<Checkbox label="Agree" />);
    expect(screen.getByLabelText("Agree")).toBeInTheDocument();
  });

  it("toggles on click and fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Agree" onChange={onChange} />);
    await user.click(screen.getByLabelText("Agree"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Agree")).toBeChecked();
  });

  it("controlled: checked prop drives state", () => {
    render(<Checkbox label="Agree" checked readOnly />);
    expect(screen.getByLabelText("Agree")).toBeChecked();
  });

  it("sets indeterminate property", () => {
    render(<Checkbox label="Agree" indeterminate />);
    const el = screen.getByLabelText("Agree") as HTMLInputElement;
    expect(el.indeterminate).toBe(true);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Agree" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox label="Agree" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});