import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("associates label", () => {
    render(<Textarea label="Bio" />);
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="Bio" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("shows error and marks invalid", () => {
    render(<Textarea label="Bio" error="Too long" />);
    expect(screen.getByText("Too long")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error via aria-describedby", () => {
    render(<Textarea label="Bio" error="Too long" />);
    const ta = screen.getByLabelText("Bio");
    const id = ta.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)).toHaveTextContent("Too long");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Textarea label="Bio" rows={4} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});