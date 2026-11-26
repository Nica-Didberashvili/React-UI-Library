import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import type { AxeResults } from "axe-core";

expect.extend({
  toHaveNoViolations(results: AxeResults) {
    const violations = results.violations ?? [];
    const pass = violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "Expected accessibility violations, found none"
          : `Expected no accessibility violations, found ${violations.length}:\n` +
            violations
              .map((v) => `  - ${v.id}: ${v.help}`)
              .join("\n"),
    };
  },
});

if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  }
}

if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.focus) {
  HTMLElement.prototype.focus = vi.fn();
}