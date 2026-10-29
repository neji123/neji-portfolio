"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import { Vector3 } from "three";

import { HEADER_OFFSET } from "@/components/motion/smooth-scroll";
import { type GlobeStop } from "@/types/journey";

import { type GlobeDriver } from "./globe-driver";
import { type LabelNodes } from "./globe-labels";
import { toVector3 } from "./globe-math";

const LABEL_LIFT = 1.01;
/** A city this close to the limb hides its label, before the arc of the globe swallows it. */
const MIN_FACING = 0.15;
/** Pixels a card keeps from the viewport edges, and its gap from the city's point. */
const EDGE_MARGIN = 12;
const POINT_GAP = 16;
/** A card never slides under the sticky header. */
const TOP_LIMIT = -HEADER_OFFSET + EDGE_MARGIN;

type GlobeLabelProjectorProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
  driver: RefObject<GlobeDriver>;
};

/**
 * Inside the Canvas: projects each city to the screen and writes the position straight onto
 * its label (no React state per frame). The card slides to stay inside the viewport, and
 * flips below the point near the top. Cities on the far side hide and leave the tab order.
 */
export function GlobeLabelProjector({ stops, nodes, driver }: GlobeLabelProjectorProps) {
  const positions = useMemo(
    () => stops.map((stop) => toVector3(stop, LABEL_LIFT, new Vector3())),
    [stops],
  );
  const scratch = useMemo(() => ({ view: new Vector3(), screen: new Vector3() }), []);
  const reachable = useRef<boolean[]>([]);

  useFrame(({ camera, size }) => {
    const { view, screen } = scratch;
    const shown = driver.current.labelsShown;
    view.copy(camera.position).normalize();
    positions.forEach((position, i) => {
      const anchor = nodes.anchors.current[i];
      if (!anchor) return;
      screen.copy(position).project(camera);
      const x = ((screen.x + 1) / 2) * size.width;
      const y = ((1 - screen.y) / 2) * size.height;
      anchor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

      const card = nodes.cards.current[i];
      const box = nodes.sizes.current[i];
      if (card && box) {
        const maxLeft = Math.max(EDGE_MARGIN, size.width - EDGE_MARGIN - box.width);
        const left = Math.min(Math.max(x - box.width / 2, EDGE_MARGIN), maxLeft);
        const below = y - POINT_GAP - box.height < TOP_LIMIT;
        const shiftY = below ? box.height + POINT_GAP * 2 : 0;
        card.style.transform = `translate3d(${(left - x).toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
      }

      const front = position.dot(view) / LABEL_LIFT > MIN_FACING;
      const facing = front ? "front" : "back";
      if (anchor.dataset.facing !== facing) anchor.dataset.facing = facing;
      const canReach = front && shown;
      if (reachable.current[i] === canReach) return;
      reachable.current[i] = canReach;
      const button = nodes.buttons.current[i];
      if (button) button.tabIndex = canReach ? 0 : -1;
    });
  });

  return null;
}
