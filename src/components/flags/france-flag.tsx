import { type FlagProps } from "./flag-props";

export function FranceFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true" focusable="false">
      <rect width="1" height="2" fill="#002654" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </svg>
  );
}
