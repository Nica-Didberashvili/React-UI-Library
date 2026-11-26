import { forwardRef, ComponentPropsWithoutRef } from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const totalSlots = siblingCount * 2 + 5;
  const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];

  if (totalPages <= totalSlots) {
    pages.push(...range(1, totalPages));
  } else {
    const leftSibling = Math.max(page - siblingCount, 2);
    const rightSibling = Math.min(page + siblingCount, totalPages - 1);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    pages.push(1);
    if (showLeftEllipsis) pages.push("ellipsis-left");
    pages.push(...range(leftSibling, rightSibling));
    if (showRightEllipsis) pages.push("ellipsis-right");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination">
      <ul
        style={{
          display: "flex",
          gap: 4,
          listStyle: "none",
          padding: 0,
          margin: 0,
          alignItems: "center",
        }}
      >
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </button>
        </li>
        {pages.map((p, i) =>
          typeof p === "number" ? (
            <li key={p}>
              <button
                type="button"
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
                style={{
                  fontWeight: p === page ? 700 : 400,
                  background: p === page ? "#0079bf" : "transparent",
                  color: p === page ? "#fff" : "#111",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            </li>
          ) : (
            <li key={`${p}-${i}`} aria-hidden="true">
              …
            </li>
          )
        )}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}