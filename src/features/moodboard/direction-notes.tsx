import { type DirectionCopy, type MoodboardUi } from "@/types/moodboard";

type DirectionNotesProps = {
  copy: DirectionCopy;
  ui: MoodboardUi;
};

/** The direction's written argument: what the first screen does, how it moves, where it could fail. */
export function DirectionNotes({ copy, ui }: DirectionNotesProps) {
  const notes = [
    { heading: ui.sections.firstViewport, body: copy.firstViewport },
    { heading: ui.sections.liveThing, body: copy.liveThing },
    { heading: ui.sections.motion, body: copy.motion },
    { heading: ui.sections.risk, body: copy.risk },
  ];

  return (
    <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
      {notes.map((note) => (
        <section key={note.heading} className="flex flex-col gap-3">
          <h3 className="mb-step-lead font-medium">{note.heading}</h3>
          <p className="mb-step-body max-w-[60ch]">{note.body}</p>
        </section>
      ))}
    </div>
  );
}
