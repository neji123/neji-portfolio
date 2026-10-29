"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

import { type GlobeStop, type JourneyStopId } from "@/types/journey";

const CITY_ATTRIBUTE = "data-globe-city";

/** The DOM nodes the projector moves each frame, one per stop, in stop order. */
export type LabelNodes = {
  buttons: RefObject<(HTMLButtonElement | null)[]>;
  cards: RefObject<(HTMLDivElement | null)[]>;
  /** Each card's size, kept by a ResizeObserver so the projector never measures in the frame loop. */
  sizes: RefObject<{ width: number; height: number }[]>;
};

type GlobeLabelsProps = {
  stops: readonly GlobeStop[];
  nodes: LabelNodes;
  /** Accessible name of the group of city buttons. */
  label: string;
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
 * The city labels, in two layers the globe's projector moves. The text sits under the page's
 * own text (it is only ink on the globe, with a soft shadow, no box). The invisible city buttons
 * sit above the content so they stay reachable: hover or focus opens a label (company and
 * years), a click goes to the role. On touch, the first tap opens, the second goes.
 */
export function GlobeLabels({
  stops,
  nodes,
  label,
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
  const { buttons, cards, sizes } = nodes;

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
    <>
      {/* The words: under the sections (z-10), over the globe. Physical top-left: the projector writes screen coordinates. */}
      <div
        aria-hidden="true"
        data-shown={shown}
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-lvh transition-opacity duration-(--duration-slow) ease-(--ease-smooth-out) data-[shown=false]:opacity-0 motion-reduce:transition-none"
      >
        {stops.map((stop, i) => {
          const open = [hovered, focused, tapped, activeStop].includes(stop.id);
          return (
            // Hidden until the first projected frame places it. The text follows the document direction.
            <div
              key={stop.id}
              ref={(element) => {
                cards.current[i] = element;
              }}
              data-facing="back"
              data-clear="true"
              data-flip="false"
              data-open={open}
              className="globe-label group/city absolute top-0 left-0 flex w-max max-w-[calc(100vw-1.5rem)] flex-col text-center type-small text-ink transition-opacity duration-(--duration-fast) ease-(--ease-smooth-out) data-[clear=false]:opacity-0 data-[facing=back]:opacity-0 data-[flip=true]:flex-col-reverse motion-reduce:transition-none"
            >
              {/* Company and years open above the city name (below it when flipped), without moving it. */}
              <div className="translate-y-1 opacity-0 transition-[opacity,translate] duration-(--duration-fast) ease-(--ease-smooth-out) group-data-[open=true]/city:translate-y-0 group-data-[open=true]/city:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
                {stop.roles.map((role) => (
                  <p key={role.id} className="text-muted">
                    <bdi>{role.company}</bdi> · <bdi>{role.period}</bdi>
                  </p>
                ))}
              </div>
              <p className="font-semibold">{stop.city}</p>
            </div>
          );
        })}
      </div>
      {/* The buttons: above the content, under the header, so a city can always be reached. */}
      <div
        role="group"
        aria-label={label}
        inert={!shown}
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-lvh"
      >
        {stops.map((stop, i) => (
          <button
            key={stop.id}
            ref={(element) => {
              buttons.current[i] = element;
            }}
            {...{ [CITY_ATTRIBUTE]: "" }}
            type="button"
            tabIndex={-1}
            data-reachable="false"
            className="absolute top-0 left-0 size-11 cursor-pointer rounded-full data-[reachable=false]:invisible data-[reachable=true]:pointer-events-auto"
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
        ))}
      </div>
    </>
  );
}
