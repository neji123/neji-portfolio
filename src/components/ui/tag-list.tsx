import { cn } from "@/lib/cn";

import { Tag } from "./tag";

type TagListProps = {
  items: readonly string[];
  label: string;
  className?: string;
};

export function TagList({ items, label, className }: TagListProps) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
