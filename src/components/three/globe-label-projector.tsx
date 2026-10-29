"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

import { HEADER_OFFSET } from "@/components/motion/smooth-scroll";
import { type GlobeStop } from "@/types/journey";

import { type GlobeDriver } from "./globe-driver";
import { type LabelNodes } from "./globe-labels";
import { toVector3 } from "./globe-math";
import { GLOBE_AVOID_ATTRIBUTE } from "./globe-scenes";

const LABEL_LIFT = 1.01;
/** A city this close to the limb hides its label, before the arc of the globe swallows it. */
const MIN_FACING = 0.15;
/** Pixels a card keeps from the viewport edges, and its gap from the city's point. */
const EDGE_MARGIN = 12;
const POINT_GAP = 16;
/** Half the city button (44px). */
const BUTTON_RADIUS = 22;
/** Room kept clear around the page elements labels must not cover. */
const AVOID_MARGIN = 8;
/** Frames between two readings of those elements' boxes (they move with the scroll). */
const AVOID_REFRESH_FRAMES = 12;
/** A card never slides under the sticky header. */
const TOP_LIMIT = -HEADER_OFFSET + EDGE_MARGIN;

type Box = { left: number; top: number; right: number; bottom: number };

function overlaps(box: Box, zones: readonly Box[]): boolean {
  return zones.some(
    (zone) =>
      box.left < zone.right &&
      box.right > zone.left &&
      box.top < zone.bottom &&
      box.bottom > zone.top,
  );
}

function setData(element: HTMLElement, key: string, value: string) {
  if (element.dataset[key] !== value) element.dataset[key] = value;
}

/** Reduced motion renders on demand: the page still scrolls under the labels, so redraw then. */
function RenderOnScroll() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const redraw = () => invalidate();
    window.addEventListener("scroll", redraw, { passive: true });
    return () => window.removeEventListener("scroll", redraw);
  }, [invalidate]);
  return null;
}

type GlobeLabelProjectorProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
  driver: RefObject<GlobeDriver>;
  reducedMotion: boolean;
};

/**
 * Inside the Canvas: projects each city to the screen and writes the position straight onto
 * its label and its button (no React state per frame). A card slides to stay inside the
 * viewport and flips below its point near the top or over protected text; if it still
 * covers that text it hides, and so does a button. Far-side cities leave the tab order.
 */
export function GlobeLabelProjector({
  stops,
  nodes,
  driver,
  reducedMotion,
}: GlobeLabelProjectorProps) {
  const positions = useMemo(
    () => stops.map((stop) => toVector3(stop, LABEL_LIFT, new Vector3())),
    [stops],
  );
  const scratch = useMemo(() => ({ view: new Vector3(), screen: new Vector3() }), []);
  const avoid = useRef<{ zones: Box[]; frame: number }>({ zones: [], frame: 0 });

  useFrame(({ camera, size }) => {
    const { view, screen } = scratch;
    const shown = driver.current.labelsShown;

    // Read the protected boxes before writing any style, every few frames (every frame on demand).
    const guard = avoid.current;
    if (reducedMotion || guard.frame % AVOID_REFRESH_FRAMES === 0) {
      guard.zones = Array.from(document.querySelectorAll(`[${GLOBE_AVOID_ATTRIBUTE}]`)).map(
        (element) => {
          const box = element.getBoundingClientRect();
          return {
            left: box.left - AVOID_MARGIN,
            top: box.top - AVOID_MARGIN,
            right: box.right + AVOID_MARGIN,
            bottom: box.bottom + AVOID_MARGIN,
          };
        },
      );
    }
    guard.frame += 1;

    view.copy(camera.position).normalize();
    positions.forEach((position, i) => {
      screen.copy(position).project(camera);
      const x = ((screen.x + 1) / 2) * size.width;
      const y = ((1 - screen.y) / 2) * size.height;
      const front = position.dot(view) / LABEL_LIFT > MIN_FACING;

      const card = nodes.cards.current[i];
      const box = nodes.sizes.current[i];
      if (card && box) {
        const maxLeft = Math.max(EDGE_MARGIN, size.width - EDGE_MARGIN - box.width);
        const left = Math.min(Math.max(x - box.width / 2, EDGE_MARGIN), maxLeft);
        const above = {
          left,
          right: left + box.width,
          top: y - POINT_GAP - box.height,
          bottom: y - POINT_GAP,
        };
        const below = {
          left,
          right: left + box.width,
          top: y + POINT_GAP,
          bottom: y + POINT_GAP + box.height,
        };
        const aboveFits = above.top >= TOP_LIMIT && !overlaps(above, guard.zones);
        const flip = !aboveFits && !overlaps(below, guard.zones);
        const placed = flip ? below : above;
        card.style.transform = `translate3d(${left.toFixed(1)}px, ${placed.top.toFixed(1)}px, 0)`;
        setData(card, "facing", front ? "front" : "back");
        setData(card, "flip", String(flip));
        setData(card, "clear", String(aboveFits || flip));
      }

      const button = nodes.buttons.current[i];
      if (button) {
        button.style.transform = `translate3d(${(x - BUTTON_RADIUS).toFixed(1)}px, ${(y - BUTTON_RADIUS).toFixed(1)}px, 0)`;
        const hit = {
          left: x - BUTTON_RADIUS,
          right: x + BUTTON_RADIUS,
          top: y - BUTTON_RADIUS,
          bottom: y + BUTTON_RADIUS,
        };
        const reachable = front && shown && !overlaps(hit, guard.zones);
        if (button.dataset.reachable !== String(reachable)) {
          button.dataset.reachable = String(reachable);
          button.tabIndex = reachable ? 0 : -1;
        }
      }
    });
  });

  return reducedMotion ? <RenderOnScroll /> : null;
}
