import { FranceFlag } from "@/components/flags/france-flag";
import { TunisiaFlag } from "@/components/flags/tunisia-flag";
import { UnitedKingdomFlag } from "@/components/flags/united-kingdom-flag";
import { cn } from "@/lib/cn";
import { type MoodboardUi } from "@/types/moodboard";

const flags = { EN: UnitedKingdomFlag, FR: FranceFlag, AR: TunisiaFlag } as const;

type FlagCode = keyof typeof flags;

function isFlagCode(code: string): code is FlagCode {
  return code in flags;
}

type SwitcherSpecimenProps = {
  ui: MoodboardUi;
  currentCode: string;
};

/** A still picture of the Phase 2 switcher: three flags, each with its visible code. */
export function SwitcherSpecimen({ ui, currentCode }: SwitcherSpecimenProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="flex gap-1">
        {ui.languages
          .filter((option) => isFlagCode(option.code))
          .map((option) => {
            const Flag = flags[option.code as FlagCode];
            return (
              <span
                key={option.code}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-3",
                  option.code === currentCode
                    ? "bg-(--mb-ink) text-(--mb-ground)"
                    : "bg-(--mb-surface)",
                )}
              >
                <Flag className="h-3.5 w-auto rounded-[2px]" />
                <span className="mb-step-small font-medium">{option.label}</span>
              </span>
            );
          })}
      </div>
      <figcaption className="mb-step-small text-(--mb-muted)">{ui.switcherCaption}</figcaption>
    </figure>
  );
}
