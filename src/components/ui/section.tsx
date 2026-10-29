import { type ReactNode } from "react";

import { Depth } from "@/components/motion/depth";
import { GLOBE_SCENE_ATTRIBUTE, type GlobeSceneId } from "@/components/three/globe-scenes";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  /** Id of the heading that names this section. */
  labelledBy: string;
  /** Where the page's one globe goes while this section is read. */
  scene: GlobeSceneId;
  className?: string;
  children: ReactNode;
};

/**
 * No background of its own: every section sits in the same night, over the fixed globe,
 * and its content enters in perspective.
 */
export function Section({ id, labelledBy, scene, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      {...{ [GLOBE_SCENE_ATTRIBUTE]: scene }}
      className={cn(
        "scene-space relative z-10 scroll-mt-header px-gutter py-section text-ink",
        className,
      )}
    >
      <Depth>{children}</Depth>
    </section>
  );
}
