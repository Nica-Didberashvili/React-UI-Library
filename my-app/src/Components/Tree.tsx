import { useState, useRef, useEffect, KeyboardEvent } from "react";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeProps {
  data: TreeNode[];
  defaultExpandedIds?: string[];
  onSelect?: (id: string) => void;
}

function getVisibleNodes(
  nodes: TreeNode[],
  expandedIds: Set<string>,
  parentId: string | null = null
): (TreeNode & { parentId: string | null; level: number })[] {
  let visible: (TreeNode & { parentId: string | null; level: number })[] = [];
  for (const node of nodes) {
    const level = parentId ? 2 : 1; // Simplified level calculation
    visible.push({ ...node, parentId, level });
    if (node.children && expandedIds.has(node.id)) {
      visible = visible.concat(getVisibleNodes(node.children, expandedIds, node.id));
    }
  }
  return visible;
}

export function Tree({ data, defaultExpandedIds = [], onSelect }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [activeId, setActiveId] = useState<string | null>(data[0]?.id ?? null);
  const treeRef = useRef<HTMLUListElement>(null);

  const visibleNodes = getVisibleNodes(data, expanded);

  useEffect(() => {
    if (!activeId) return;
    const el = document.getElementById(`tree-item-${activeId}`);
    el?.focus();
  }, [activeId]);

  const toggleExpand = (id: string, force?: boolean) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (force === true) next.add(id);
      else if (force === false) next.delete(id);
      else if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!activeId) return;
    const idx = visibleNodes.findIndex((n) => n.id === activeId);
    const node = visibleNodes[idx];
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (idx < visibleNodes.length - 1) setActiveId(visibleNodes[idx + 1].id);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (idx > 0) setActiveId(visibleNodes[idx - 1].id);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (hasChildren && !isExpanded) {
          toggleExpand(node.id, true);
        } else if (hasChildren && isExpanded) {
          setActiveId(node.children![0].id);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (hasChildren && isExpanded) {
          toggleExpand(node.id, false);
        } else if (node.parentId) {
          setActiveId(node.parentId);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (hasChildren) toggleExpand(node.id);
        onSelect?.(node.id);
        break;
    }
  };

  const renderNode = (node: TreeNode, level = 1) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isActive = activeId === node.id;

    return (
      <li
        key={node.id}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isActive}
        id={`tree-item-${node.id}`}
        tabIndex={isActive ? 0 : -1}
        onKeyDown={onKeyDown}
        onClick={() => {
          setActiveId(node.id);
          onSelect?.(node.id);
        }}
        style={{
          listStyle: "none",
          padding: "4px 8px",
          paddingLeft: level * 20,
          cursor: "pointer",
          outline: isActive ? "2px solid #2563eb" : "none",
          background: isActive ? "#e8f0fe" : "transparent",
          borderRadius: 4,
        }}
      >
        <span onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(node.id); }}>
          {hasChildren ? (isExpanded ? "▼ " : "▶ ") : "• "}
        </span>
        {node.label}

        {hasChildren && isExpanded && (
          <ul role="group" style={{ padding: 0, margin: 0 }}>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul role="tree" ref={treeRef} style={{ padding: 0, margin: 0 }}>
      {data.map((node) => renderNode(node))}
    </ul>
  );
}