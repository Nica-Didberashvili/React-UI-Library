import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RadioGroup, Radio } from "./Radio";

describe("Radio", () => {
  it("renders with labels and checks default value", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    expect(screen.getByLabelText("Option A")).toBeChecked();
    expect(screen.getByLabelText("Option B")).not.toBeChecked();
  });

  it("clicking a radio selects it and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onValueChange={onChange}>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    await user.click(screen.getByLabelText("Option B"));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByLabelText("Option B")).toBeChecked();
  });

  it("controlled: ignores internal click", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup value="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    await user.click(screen.getByLabelText("Option B"));
    expect(screen.getByLabelText("Option A")).toBeChecked();
  });

  it("radios share a name within the group", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    const a = screen.getByLabelText("A") as HTMLInputElement;
    const b = screen.getByLabelText("B") as HTMLInputElement;
    expect(a.name).toBe(b.name);
    expect(a.name).toBeTruthy();
  });

  it("radiogroup role is present", () => {
    render(
      <RadioGroup>
        <Radio value="a" label="A" />
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});