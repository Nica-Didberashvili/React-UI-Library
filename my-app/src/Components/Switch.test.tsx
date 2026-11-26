import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("has role=switch and a label", () => {
    render(<Switch label="Notifications" />);
    expect(
      screen.getByRole("switch", { name: "Notifications" })
    ).toBeInTheDocument();
  });

  it("toggles on click and fires onCheckedChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on Space keypress", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onChange} />);
    screen.getByRole("switch").focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("controlled: checked prop drives aria-checked", () => {
    render(<Switch label="Notifications" checked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("uncontrolled: defaultChecked sets initial", () => {
    render(<Switch label="Notifications" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Switch label="Notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});