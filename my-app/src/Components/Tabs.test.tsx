import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tabs, TabsList, TabsTrigger, TabsPanel } from "./Tabs";

function Sample() {
  return (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c">Tab C</TabsTrigger>
      </TabsList>
      <TabsPanel value="a">Panel A</TabsPanel>
      <TabsPanel value="b">Panel B</TabsPanel>
      <TabsPanel value="c">Panel C</TabsPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the default panel and hides others", () => {
    render(<Sample />);
    expect(screen.getByText("Panel A")).toBeInTheDocument();
    expect(screen.queryByText("Panel B")).not.toBeInTheDocument();
  });

  it("clicking a tab switches panel", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(screen.getByText("Panel B")).toBeInTheDocument();
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
  });

  it("aria-selected is on the active tab only", () => {
    render(<Sample />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("ArrowRight moves to next tab", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const tabA = screen.getByRole("tab", { name: "Tab A" });
    tabA.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft wraps from first to last", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    screen.getByRole("tab", { name: "Tab A" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Tab C" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("Home/End jump", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    screen.getByRole("tab", { name: "Tab B" }).focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Tab C" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("active tab has tabindex 0, others -1", () => {
    render(<Sample />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("tabindex", "-1");
  });

  it("panel has aria-labelledby pointing to trigger", () => {
    render(<Sample />);
    const panel = screen.getByRole("tabpanel");
    const labelledBy = panel.getAttribute("aria-labelledby");
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Tab A");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Sample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});