import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onSort,
  sortKey,
  sortDirection,
}: TableProps<T>) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
          {columns.map((col) => {
            const isSorted = sortKey === col.key;
            const ariaSort = isSorted
              ? sortDirection === "asc"
                ? "ascending"
                : "descending"
              : undefined;

            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={ariaSort}
                onClick={() => col.sortable && onSort?.(col.key)}
                style={{
                  padding: "12px 16px",
                  fontWeight: 600,
                  color: "#475569",
                  cursor: col.sortable ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                {col.header}
                {col.sortable && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: "#94a3b8" }}>
                    {isSorted ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={keyExtractor(row)}
            style={{ borderBottom: "1px solid #e2e8f0" }}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ padding: "12px 16px" }}>
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}