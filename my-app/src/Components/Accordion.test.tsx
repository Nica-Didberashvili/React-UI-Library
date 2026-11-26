import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "./Accordion";

function Sample() {
  return (
    <Accordion type="single" defaultValue={["a"]}>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionPanel>Content A</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionPanel>Content B</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("shows default open panel", () => {
    render(<Sample />);
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.queryByText("Content B")).not.toBeInTheDocument();
  });

  it("clicking a trigger toggles its panel (single closes others)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /section b/i }));
    expect(screen.getByText("Content B")).toBeInTheDocument();
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
  });

  it("multiple: opens more than one", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionPanel>CA</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionPanel>CB</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole("button", { name: "A" }));
    await user.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("CA")).toBeInTheDocument();
    expect(screen.getByText("CB")).toBeInTheDocument();
  });

  it("aria-expanded reflects state", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const triggerB = screen.getByRole("button", { name: /section b/i });
    expect(triggerB).toHaveAttribute("aria-expanded", "false");
    await user.click(triggerB);
    expect(triggerB).toHaveAttribute("aria-expanded", "true");
  });

  it("panel has aria-labelledby pointing to trigger", () => {
    render(<Sample />);
    const region = screen.getByRole("region");
    const labelledBy = region.getAttribute("aria-labelledby");
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Section A");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Sample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});