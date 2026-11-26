import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Select } from "./Select";

const numericOptions = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

describe("Select", () => {
  it("selects a generic value (number) and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={numericOptions} onValueChange={onChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Two" }));

    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button")).toHaveTextContent("Two");
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<Select options={numericOptions} />);
    await user.click(screen.getByRole("button"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});