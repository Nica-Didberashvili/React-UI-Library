import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ContextMenu, ContextMenuItem } from "./ContextMenu";

describe("ContextMenu", () => {
  it("opens on right click", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu
        menu={<ContextMenuItem onClick={() => {}}>Action</ContextMenuItem>}
      >
        Right click me
      </ContextMenu>
    );

    const area = screen.getByText("Right click me");
    await user.pointer({ keys: "[MouseRight]", target: area });
    
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("calls action and closes on item click", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ContextMenu
        menu={<ContextMenuItem onClick={action}>Delete</ContextMenuItem>}
      >
        Right click me
      </ContextMenu>
    );

    await user.pointer({ keys: "[MouseRight]", target: screen.getByText("Right click me") });
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu
        menu={<ContextMenuItem onClick={() => {}}>Action</ContextMenuItem>}
      >
        Right click me
      </ContextMenu>
    );
    await user.pointer({ keys: "[MouseRight]", target: screen.getByText("Right click me") });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});