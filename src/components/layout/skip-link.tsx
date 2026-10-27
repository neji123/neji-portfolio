type SkipLinkProps = {
  label: string;
};

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-full bg-ink px-5 py-3 type-small font-medium text-ground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {label}
    </a>
  );
}
