import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ToastProvider, useToast } from "./Toast";

function TestComponent() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({ title: "Saved!", description: "Your changes are safe.", variant: "success" })
      }
    >
      Show Toast
    </button>
  );
}

describe("Toast", () => {
  it("does not render toasts initially", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows a toast when triggered via hook", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Toast" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Saved!")).toBeInTheDocument();
    expect(screen.getByText("Your changes are safe.")).toBeInTheDocument();
  });

  it("dismisses manually via close button", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show Toast" }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await user.click(screen.getByRole("button", { name: "Show Toast" }));
    
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});