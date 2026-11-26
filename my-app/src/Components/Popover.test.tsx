import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("does not render content when closed", () => {
    render(
      <Popover trigger="Open">
        <p>Hidden</p>
      </Popover>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger="Open">
        <p>Content</p>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("toggles closed on second trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger="Open">
        <p>Content</p>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger="Open">
        <p>Content</p>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover trigger="Open">
          <p>Content</p>
        </Popover>
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("controlled: open prop drives visibility", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover trigger="Open" open={false} onOpenChange={onOpenChange}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    rerender(
      <Popover trigger="Open" open={true} onOpenChange={onOpenChange}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover trigger="Open">
        <p>Content</p>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});