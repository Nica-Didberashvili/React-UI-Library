import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePopup } from "./usePopup";

describe("usePopup", () => {
  it("starts closed by default", () => {
    const { result } = renderHook(() => usePopup());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects defaultOpen", () => {
    const { result } = renderHook(() => usePopup({ defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it("toggle flips state", () => {
    const { result } = renderHook(() => usePopup());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("close() sets to false", () => {
    const { result } = renderHook(() => usePopup({ defaultOpen: true }));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it("controlled: value prop drives isOpen", () => {
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) => usePopup({ open }),
      { initialProps: { open: false } }
    );
    expect(result.current.isOpen).toBe(false);
    rerender({ open: true });
    expect(result.current.isOpen).toBe(true);
  });

  it("controlled: calls onOpenChange on toggle", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      usePopup({ open: false, onOpenChange })
    );
    act(() => result.current.toggle());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("Escape closes and fires onOpenChange when open", () => {
    const onOpenChange = vi.fn();
    renderHook(() => usePopup({ defaultOpen: true, onOpenChange }));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape does nothing when closed", () => {
    const onOpenChange = vi.fn();
    renderHook(() => usePopup({ onOpenChange }));
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("outside mousedown closes when open", () => {
    const onOpenChange = vi.fn();
    renderHook(() => usePopup({ defaultOpen: true, onOpenChange }));

    const outside = document.createElement("div");
    document.body.appendChild(outside);
    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    document.body.removeChild(outside);
  });

  it("provides a stable contentId", () => {
    const { result } = renderHook(() => usePopup());
    expect(typeof result.current.contentId).toBe("string");
    expect(result.current.contentId.length).toBeGreaterThan(0);
  });
});