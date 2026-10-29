"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";

import { type GlobeStop, type JourneyStopId } from "@/types/journey";

import { toVector3 } from "./globe-math";

const LABEL_LIFT = 1.01;
/** A city this close to the limb hides its label, before the arc of the globe swallows it. */
const MIN_FACING = 0.15;
/** Labels stay inside the canvas' own stacking context, under the sticky header. */
const Z_INDEX_RANGE = [3, 0];
const CITY_ATTRIBUTE = "data-globe-city";

type GlobeLabelsProps = {
  stops: readonly GlobeStop[];
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
 * Each city is a real button positioned over the globe: hover or focus opens its label
 * (company and years), a click goes to the role. On touch, the first tap opens, the second goes.
 */
export function GlobeLabels({ stops, activeStop, hint, onHover, onSelect }: GlobeLabelsProps) {
  const [hovered, setHovered] = useState<JourneyStopId | null>(null);
  const [focused, setFocused] = useState<JourneyStopId | null>(null);
  const [tapped, setTapped] = useState<JourneyStopId | null>(null);
  const pointerType = useRef("");
  const wrappers = useRef<(HTMLDivElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const facing = useRef<boolean[]>([]);
  const positions = useMemo(
    () => stops.map((stop) => toVector3(stop, LABEL_LIFT, new Vector3())),
    [stops],
  );
  const view = useMemo(() => new Vector3(), []);

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

  // Cities on the far side of the globe hide and leave the tab order.
  useFrame(({ camera }) => {
    view.copy(camera.position).normalize();
    positions.forEach((position, i) => {
      const front = position.dot(view) / LABEL_LIFT > MIN_FACING;
      if (facing.current[i] === front) return;
      facing.current[i] = front;
      const wrapper = wrappers.current[i];
      const button = buttons.current[i];
      if (wrapper) wrapper.dataset.facing = front ? "front" : "back";
      if (button) button.tabIndex = front ? 0 : -1;
    });
  });

  const hover = (stop: JourneyStopId | null) => {
    setHovered(stop);
    onHover(stop);
  };

  return (
    <>
      {stops.map((stop, i) => {
        const open = [hovered, focused, tapped, activeStop].includes(stop.id);
        return (
          <Html key={stop.id} position={positions[i]} zIndexRange={Z_INDEX_RANGE}>
            <div
              ref={(element) => {
                wrappers.current[i] = element;
              }}
              {...{ [CITY_ATTRIBUTE]: "" }}
              data-open={open}
              className="group/city relative transition-opacity duration-300 data-[facing=back]:pointer-events-none data-[facing=back]:opacity-0 motion-reduce:transition-none"
            >
              <button
                ref={(element) => {
                  buttons.current[i] = element;
                }}
                type="button"
                className="pointer-events-auto absolute start-0 top-0 size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full rtl:translate-x-1/2"
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
              <div
                aria-hidden="true"
                className="pointer-events-none absolute start-0 bottom-4 -translate-x-1/2 bg-ground/85 px-2.5 py-1 text-center type-small whitespace-nowrap text-ink rtl:translate-x-1/2"
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
          </Html>
        );
      })}
    </>
  );
}
