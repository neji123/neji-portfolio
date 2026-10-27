import { type Swatch } from "@/types/moodboard";

type SwatchListProps = {
  swatches: readonly Swatch[];
};

export function SwatchList({ swatches }: SwatchListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {swatches.map((swatch) => (
        <li key={swatch.token} className="flex flex-col gap-3">
          {/* A tone-step mat, so a swatch equal to the ground still reads. */}
          <span aria-hidden="true" className="block bg-(--mb-surface) p-2">
            <span className="block aspect-[4/3] w-full" style={{ background: swatch.value }} />
          </span>
          <span className="flex flex-col">
            <span className="mb-step-body font-medium">{swatch.name}</span>
            <span className="mb-step-small text-(--mb-muted)">{swatch.use}</span>
            <span className="mb-step-small mb-tabular text-(--mb-muted)" dir="ltr">
              {swatch.value}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
