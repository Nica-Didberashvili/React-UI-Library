import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Modal } from "./Modal";

function TestHarness({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          onOpenChange?.(o);
        }}
        title="Test Dialog"
      >
        <p>Dialog content</p>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("does not render content when closed", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="X">
        <p>Hidden</p>
      </Modal>
    );
    expect(screen.queryByText("Hidden")).not.toBeVisible();
  });

  it("opens with title and content", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("Escape closes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestHarness onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("clicking the close ✕ closes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestHarness onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has aria-modal and aria-labelledby", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});