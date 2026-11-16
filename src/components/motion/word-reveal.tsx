import { Fragment } from "react";

import { GLOBE_AVOID_ATTRIBUTE } from "@/components/three/globe-scenes";

const FIRST_WORD_DELAY_MS = 120;
const WORD_STAGGER_MS = 70;

type WordRevealProps = {
  as: "h1" | "p";
  text: string;
  id?: string;
  className?: string;
  /** Keeps the globe's city labels off this text (see GLOBE_AVOID_ATTRIBUTE). */
  avoidGlobe?: boolean;
};

/**
 * Words settle into place one after another on first paint. CSS only, and every word is
 * visible from the first frame (no mask, no opacity 0), so the text paints at once (LCP)
 * and works without JavaScript. Splits on spaces, never inside a word, which keeps Arabic
 * letters joined. The spaces sit between the words: inside an inline-block a trailing space
 * collapses, and the words would run together.
 */
export function WordReveal({ as: Tag, text, id, className, avoidGlobe }: WordRevealProps) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={className} {...(avoidGlobe ? { [GLOBE_AVOID_ATTRIBUTE]: "" } : {})}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span
            className="word-rise"
            style={{ animationDelay: `${FIRST_WORD_DELAY_MS + index * WORD_STAGGER_MS}ms` }}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
