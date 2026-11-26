import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Dropdown } from "./Dropdown";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "dragonfruit", label: "Dragonfruit" },
];

describe("Dropdown", () => {
  it("shows the selected label or placeholder", () => {
    const { unmount } = render(
      <Dropdown options={options} defaultValue="apple" />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Apple");
    
    unmount();
    
    render(<Dropdown options={options} />);
    expect(screen.getByRole("button")).toHaveTextContent("Select…");
  });

  it("opens on click and closes on second click", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clicking an option selects it, closes, and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={options} onValueChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Banana" }));
    expect(onChange).toHaveBeenCalledWith("banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Banana");
  });

  it("disabled options are not selectable on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={options} onValueChange={onChange} />);
    await user.click(screen.getByRole("button"));
    const cherry = screen.getByRole("option", { name: "Cherry" });
    expect(cherry).toHaveAttribute("aria-disabled", "true");
    await user.click(cherry);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Escape closes and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("outside click closes", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Dropdown options={options} />
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: /select/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ArrowDown opens and highlights first enabled option", async () => {
      const user = userEvent.setup();
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole("button");
      trigger.focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      
      // Look at the listbox for aria-activedescendant, not the trigger
      const listbox = screen.getByRole("listbox");
      const active = listbox.getAttribute("aria-activedescendant");
      expect(document.getElementById(active!)).toHaveTextContent("Apple");
    });

 it("ArrowDown skips disabled options", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}"); // opens, highlights Apple
    await user.keyboard("{ArrowDown}"); // Banana
    await user.keyboard("{ArrowDown}"); // skips Cherry -> Dragonfruit
    
    const listbox = screen.getByRole("listbox");
    const active = listbox.getAttribute("aria-activedescendant");
    expect(document.getElementById(active!)).toHaveTextContent("Dragonfruit");
  });

  it("ArrowUp wraps from first to last", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowUp}");
    
    const listbox = screen.getByRole("listbox");
    const active = listbox.getAttribute("aria-activedescendant");
    expect(document.getElementById(active!)).toHaveTextContent("Dragonfruit");
  });

  it("Enter selects the highlighted option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={options} onValueChange={onChange} />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("controlled: value prop drives label", () => {
    render(<Dropdown options={options} value="banana" />);
    expect(screen.getByRole("button")).toHaveTextContent("Banana");
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(<Dropdown options={options} />);
    await user.click(screen.getByRole("button"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});