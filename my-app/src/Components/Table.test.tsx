import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Table, Column } from "./Table";

interface User {
  id: string;
  name: string;
  age: number;
}

const columns: Column<User>[] = [
  { key: "name", header: "Name", render: (u) => u.name, sortable: true },
  { key: "age", header: "Age", render: (u) => u.age, sortable: true },
];

const data: User[] = [
  { id: "1", name: "Alice", age: 28 },
  { id: "2", name: "Bob", age: 34 },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(
      <Table data={data} columns={columns} keyExtractor={(u) => u.id} />
    );
    expect(screen.getByRole("columnheader", { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument();
  });

  it("fires onSort when a sortable header is clicked", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table
        data={data}
        columns={columns}
        keyExtractor={(u) => u.id}
        onSort={onSort}
      />
    );
    await user.click(screen.getByRole("columnheader", { name: /Age/ }));
    expect(onSort).toHaveBeenCalledWith("age");
  });

  it("applies aria-sort correctly", () => {
    render(
      <Table
        data={data}
        columns={columns}
        keyExtractor={(u) => u.id}
        sortKey="name"
        sortDirection="asc"
      />
    );
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Table data={data} columns={columns} keyExtractor={(u) => u.id} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});