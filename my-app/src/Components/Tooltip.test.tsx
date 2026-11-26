import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("does not render tooltip initially", () => {
    render(
      <Tooltip content="Help text">
        <span>Hover me</span>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on hover after delay", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });
  });

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    await user.unhover(trigger);
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    );
  });

  it("shows tooltip on focus (keyboard access)", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });
  });

  it("hides tooltip on blur", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    await user.tab();
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    await user.tab();
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    );
  });

it("Escape dismisses the tooltip", async () => {
  const user = userEvent.setup();
  render(
    <Tooltip content="Help text" delay={0}>
      <span>Hover me</span>
    </Tooltip>
  );
  await user.hover(screen.getByText("Hover me"));
  await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());

  const trigger = screen
    .getByText("Hover me")
    .closest("[tabindex='0']") as HTMLElement;
  trigger.focus();

  await user.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  );
});

  it("has aria-describedby pointing to tooltip when open", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    const describedBy = screen
      .getByText("Hover me")
      .closest("[aria-describedby]")
      ?.getAttribute("aria-describedby");
    expect(document.getElementById(describedBy!)).toHaveRole("tooltip");
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Help text" delay={0}>
        <span>Hover me</span>
      </Tooltip>
    );
    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});