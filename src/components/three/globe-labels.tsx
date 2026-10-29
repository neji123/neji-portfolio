"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";

import { type GlobeStop, type JourneyStopId } from "@/types/journey";

import { toVector3 } from "./globe-math";

const LABEL_LIFT = 1.01;
/** A city this close to the limb hides its label, before the arc of the globe swallows it. */
const MIN_FACING = 0.15;
const CITY_ATTRIBUTE = "data-globe-city";

/** The DOM nodes the projector moves each frame, one per stop, in stop order. */
export type LabelNodes = {
  anchors: RefObject<(HTMLDivElement | null)[]>;
  buttons: RefObject<(HTMLButtonElement | null)[]>;
};

type GlobeLabelProjectorProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
};

/**
 * Inside the Canvas: projects each city to the screen and writes the position straight onto
 * its label (no React state per frame). Cities on the far side hide and leave the tab order.
 */
export function GlobeLabelProjector({ stops, nodes }: GlobeLabelProjectorProps) {
  const positions = useMemo(
    () => stops.map((stop) => toVector3(stop, LABEL_LIFT, new Vector3())),
    [stops],
  );
  const scratch = useMemo(() => ({ view: new Vector3(), screen: new Vector3() }), []);
  const facing = useRef<boolean[]>([]);

  useFrame(({ camera, size }) => {
    const { view, screen } = scratch;
    view.copy(camera.position).normalize();
    positions.forEach((position, i) => {
      const anchor = nodes.anchors.current[i];
      if (!anchor) return;
      screen.copy(position).project(camera);
      const x = ((screen.x + 1) / 2) * size.width;
      const y = ((1 - screen.y) / 2) * size.height;
      anchor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

      const front = position.dot(view) / LABEL_LIFT > MIN_FACING;
      if (facing.current[i] === front) return;
      facing.current[i] = front;
      anchor.dataset.facing = front ? "front" : "back";
      const button = nodes.buttons.current[i];
      if (button) button.tabIndex = front ? 0 : -1;
    });
  });

  return null;
}

type GlobeLabelsProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
  /** The stop of the role being read keeps its label open. */
  activeStop: JourneyStopId | null;
  /** Spoken after each city's roles, e.g. "Show in Experience". */
  hint: string;
  onHover: (stop: JourneyStopId | null) => void;
  onSelect: (stop: JourneyStopId) => void;
};

function accessibleName(stop: GlobeStop, hint: string): string {
  const roles = stop.roles.map((role) => `${role.company}, ${role.period}`).join("; ");
  return `${stop.city}: ${roles}. ${hint}`;
}

/**
 * The city labels: one ordinary DOM layer over the canvas. Each city is a real button:
 * hover or focus opens its label (company and years), a click goes to the role. On touch,
 * the first tap opens, the second goes.
 */
export function GlobeLabels({
  stops,
  nodes,
  activeStop,
  hint,
  onHover,
  onSelect,
}: GlobeLabelsProps) {
  const [hovered, setHovered] = useState<JourneyStopId | null>(null);
  const [focused, setFocused] = useState<JourneyStopId | null>(null);
  const [tapped, setTapped] = useState<JourneyStopId | null>(null);
  const pointerType = useRef("");

  // A tap anywhere else closes the tapped label.
  useEffect(() => {
    if (tapped === null) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(`[${CITY_ATTRIBUTE}]`)) return;
      setTapped(null);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [tapped]);

  const hover = (stop: JourneyStopId | null) => {
    setHovered(stop);
    onHover(stop);
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stops.map((stop, i) => {
        const open = [hovered, focused, tapped, activeStop].includes(stop.id);
        return (
          // Physical top-left: the projector writes screen coordinates, which do not mirror in RTL.
          // Hidden until the first projected frame places it.
          <div
            key={stop.id}
            ref={(element) => {
              nodes.anchors.current[i] = element;
            }}
            {...{ [CITY_ATTRIBUTE]: "" }}
            data-facing="back"
            data-open={open}
            className="group/city absolute top-0 left-0 transition-opacity duration-300 data-[facing=back]:pointer-events-none data-[facing=back]:opacity-0 motion-reduce:transition-none"
          >
            <button
              ref={(element) => {
                nodes.buttons.current[i] = element;
              }}
              type="button"
              tabIndex={-1}
              className="pointer-events-auto absolute top-0 left-0 size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
              onPointerDown={(event) => {
                pointerType.current = event.pointerType;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") hover(stop.id);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") hover(null);
              }}
              onFocus={() => setFocused(stop.id)}
              onBlur={() => setFocused(null)}
              onClick={() => {
                const touch = pointerType.current === "touch" || pointerType.current === "pen";
                pointerType.current = "";
                if (touch && tapped !== stop.id) {
                  setTapped(stop.id);
                  return;
                }
                setTapped(null);
                onSelect(stop.id);
              }}
            >
              <span className="sr-only">{accessibleName(stop, hint)}</span>
            </button>
            {/* The text itself follows the document direction, so Arabic reads right to left. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 left-0 -translate-x-1/2 bg-ground/85 px-2.5 py-1 text-center type-small whitespace-nowrap text-ink"
            >
              <p className="font-semibold">{stop.city}</p>
              <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 group-data-[open=true]/city:grid-rows-[1fr] group-data-[open=true]/city:opacity-100 motion-reduce:transition-none">
                <div className="overflow-hidden">
                  {stop.roles.map((role) => (
                    <p key={role.id} className="text-muted">
                      <bdi>{role.company}</bdi> · <bdi>{role.period}</bdi>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
