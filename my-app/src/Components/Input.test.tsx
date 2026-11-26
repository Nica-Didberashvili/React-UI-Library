import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("associates label with input", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="x" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByLabelText("Name");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("shows error and marks input invalid", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("associates error via aria-describedby", () => {
    render(<Input label="Email" error="Required" />);
    const input = screen.getByLabelText("Email");
    const errorId = input.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId!)).toHaveTextContent("Required");
  });

  it("no aria-invalid when no error", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Input label="Email" placeholder="a@b.c" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});