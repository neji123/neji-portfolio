import { type Localized, type LocalizedText } from "./localized";

export type SkillGroupId = "frontend" | "backend" | "databases" | "devops" | "ai-data" | "tools";

export type SkillGroup = {
  id: SkillGroupId;
  name: Localized<string>;
  items: readonly LocalizedText[];
};
