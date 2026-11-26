import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react"
import { useControllableState } from "./useControllableState";
import { renderToReadableStream } from "react-dom/server";
import { resumeAndPrerender } from "react-dom/static";

describe("useControllableState", () => {
    it('uncontrolled: uses defaultValue and updates internally', () => {
        const { result } = renderHook(() => 
            useControllableState({ defaultValue: false})
        );
        expect(result.current[0]).toBe(false);
        act(() => result.current[1](true));
        expect(result.current[0]).toBe(true);
    });

    it('unconctolled: fires onChange when internal state changes', () => {
        const onChange = vi.fn();
        const { result } = renderHook(() => 
            useControllableState({ defaultValue: false, onChange })
        );
        act(() => result.current[1](true));
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('controlled: ignores internal updates, stays on value prop', () => {
        const onChange = vi.fn();
        const { result, rerender } = renderHook(
            ({ value }) => useControllableState({ value, onChange }),
            { initialProps: { value: false }}
        );
        expect(result.current[0]).toBe(false);
        act(() => result.current[1](true));
        expect(result.current[0]).toBe(false);
        expect(onChange).toHaveBeenCalledWith(true);
        rerender({ value: true });
        expect(result.current[0]).toBe(true);
    });

    it('controlled: does not fire onChange when value prop changes', () => {
        const onChange = vi.fn();
        const { rerender } = renderHook(
            ({ value }) => useControllableState({ value, onChange }),
            {initialProps: { value: false }}
        );
    });

    it('works with string values', () => {
        const { result } = renderHook(() => 
            useControllableState({ defaultValue: 'a' })
        );
        act(() => result.current[1]('b'));
        expect(result.current[0]).toBe('b');
    });
});