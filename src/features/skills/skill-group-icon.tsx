import { IconFrame } from "@/components/ui/icons";
import { type SkillGroupId } from "@/types/skill";

// Drawn as one set with the site's icons: 1.5 stroke, currentColor, never mirrored.
const paths: Record<SkillGroupId, string> = {
  frontend: "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01",
  backend: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  databases:
    "M5 6c0-1.66 3.13-3 7-3s7 1.34 7 3-3.13 3-7 3-7-1.34-7-3zM5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3",
  devops: "M7 8a4 4 0 1 0 0 8c2.5 0 3.5-2 5-4s2.5-4 5-4a4 4 0 1 1 0 8c-2.5 0-3.5-2-5-4s-2.5-4-5-4z",
  "ai-data":
    "M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  tools:
    "M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2.6-.6-.6-2.6z",
};

type SkillGroupIconProps = {
  group: SkillGroupId;
  className?: string;
};

export function SkillGroupIcon({ group, className }: SkillGroupIconProps) {
  return (
    <IconFrame className={className}>
      <path d={paths[group]} />
    </IconFrame>
  );
}
