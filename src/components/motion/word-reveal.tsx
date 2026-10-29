import { Fragment } from "react";

const FIRST_WORD_DELAY_MS = 120;
const WORD_STAGGER_MS = 70;

type WordRevealProps = {
  as: "h1" | "p";
  text: string;
  id?: string;
  className?: string;
};

/**
 * Words rise out of a mask on first paint. CSS only, so the text is in the HTML and
 * paints at once (LCP), and works without JavaScript. Splits on spaces, never inside
 * a word, which keeps Arabic letters joined. The spaces sit between the masks: inside an
 * inline-block a trailing space collapses, and the words would run together.
 */
export function WordReveal({ as: Tag, text, id, className }: WordRevealProps) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="word-mask">
            <span
              className="word-rise"
              style={{ animationDelay: `${FIRST_WORD_DELAY_MS + index * WORD_STAGGER_MS}ms` }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
