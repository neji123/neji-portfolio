"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

import { type GlobeStop, type JourneyStopId } from "@/types/journey";

const CITY_ATTRIBUTE = "data-globe-city";

/** The DOM nodes the projector moves each frame, one per stop, in stop order. */
export type LabelNodes = {
  anchors: RefObject<(HTMLDivElement | null)[]>;
  buttons: RefObject<(HTMLButtonElement | null)[]>;
  cards: RefObject<(HTMLDivElement | null)[]>;
  /** Each card's size, kept by a ResizeObserver so the projector never measures in the frame loop. */
  sizes: RefObject<{ width: number; height: number }[]>;
};

type GlobeLabelsProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
  /** False in the scenes where the globe is only atmosphere: the labels fade out. */
  shown: boolean;
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
 * The city labels: one ordinary DOM layer over the page, moved by the globe's projector.
 * Each city is a real button: hover or focus opens its label (company and years), a click
 * goes to the role. On touch, the first tap opens, the second goes.
 */
export function GlobeLabels({
  stops,
  nodes,
  shown,
  activeStop,
  hint,
  onHover,
  onSelect,
}: GlobeLabelsProps) {
  const [hovered, setHovered] = useState<JourneyStopId | null>(null);
  const [focused, setFocused] = useState<JourneyStopId | null>(null);
  const [tapped, setTapped] = useState<JourneyStopId | null>(null);
  const pointerType = useRef("");
  const { anchors, buttons, cards, sizes } = nodes;

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

  useEffect(() => {
    const measured = sizes.current;
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const index = cards.current.indexOf(entry.target as HTMLDivElement);
        if (index < 0) return;
        const box = entry.borderBoxSize[0];
        measured[index] = {
          width: box?.inlineSize ?? entry.contentRect.width,
          height: box?.blockSize ?? entry.contentRect.height,
        };
      });
    });
    cards.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, [cards, sizes, stops]);

  const hover = (stop: JourneyStopId | null) => {
    setHovered(stop);
    onHover(stop);
  };

  return (
    <div
      data-shown={shown}
      className="pointer-events-none absolute inset-0 transition-opacity duration-500 data-[shown=false]:opacity-0 motion-reduce:transition-none"
    >
      {stops.map((stop, i) => {
        const open = [hovered, focused, tapped, activeStop].includes(stop.id);
        return (
          // Physical top-left: the projector writes screen coordinates, which do not mirror in RTL.
          // Hidden until the first projected frame places it.
          <div
            key={stop.id}
            ref={(element) => {
              anchors.current[i] = element;
            }}
            {...{ [CITY_ATTRIBUTE]: "" }}
            data-facing="back"
            data-open={open}
            className="group/city absolute top-0 left-0 transition-opacity duration-300 data-[facing=back]:pointer-events-none data-[facing=back]:opacity-0 motion-reduce:transition-none"
          >
            <button
              ref={(element) => {
                buttons.current[i] = element;
              }}
              type="button"
              tabIndex={-1}
              className="absolute top-0 left-0 size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full group-data-[facing=front]/city:pointer-events-auto in-data-[shown=false]:pointer-events-none!"
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
            {/*
              The card sizes to its content; the projector slides it sideways to keep it inside
              the viewport and flips it under the point near the top. The text follows the
              document direction, so Arabic reads right to left.
            */}
            <div
              ref={(element) => {
                cards.current[i] = element;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 left-0 w-max max-w-[calc(100vw-1.5rem)] bg-ground/85 px-2.5 py-1 text-center type-small text-ink"
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
