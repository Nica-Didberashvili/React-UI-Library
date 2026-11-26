import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Combobox } from "./Combobox";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Combobox", () => {
  it("filters options as you type", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    
    await user.type(screen.getByRole("combobox"), "ban");
    
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();
  });

  it("selects with Enter and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onValueChange={onChange} />);
    
    const input = screen.getByRole("combobox");
    await user.type(input, "che");
    await user.keyboard("{Enter}");
    
    expect(onChange).toHaveBeenCalledWith("cherry");
    expect(input).toHaveValue("Cherry");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox options={options} />);
    await user.click(screen.getByRole("combobox"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});