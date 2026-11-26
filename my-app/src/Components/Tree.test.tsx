import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tree } from "./Tree";

const data = [
  {
    id: "1",
    label: "Documents",
    children: [
      { id: "1-1", label: "Resume.pdf" },
      { id: "1-2", label: "CoverLetter.pdf" },
    ],
  },
  { id: "2", label: "Pictures" },
];

describe("Tree", () => {
  it("renders collapsed by default", () => {
    render(<Tree data={data} />);
    expect(screen.queryByText("Resume.pdf")).not.toBeInTheDocument();
  });

  it("ArrowRight expands a node, ArrowLeft collapses", async () => {
    const user = userEvent.setup();
    render(<Tree data={data} />);
    
    screen.getByText("Documents").focus();
    
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Resume.pdf")).toBeInTheDocument();
    
    await user.keyboard("{ArrowLeft}");
    expect(screen.queryByText("Resume.pdf")).not.toBeInTheDocument();
  });

  it("ArrowDown navigates to next visible item", async () => {
    const user = userEvent.setup();
    render(<Tree data={data} defaultExpandedIds={["1"]} />);
    
    screen.getByText("Documents").focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("Resume.pdf")).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tree data={data} defaultExpandedIds={["1"]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});