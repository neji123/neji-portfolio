import { ButtonLink } from "@/components/ui/button";
import { ExternalIcon } from "@/components/ui/icons";

type CredentialCardProps = {
  id: string;
  name: string;
  issuer: string;
  /** Short mark set large on the card's plate, e.g. "CCNA". */
  mark: string;
  url: string;
  linkLabel: string;
};

/** A credential verified elsewhere: no scan to show, so the plate carries its name in type. */
export function CredentialCard({ id, name, issuer, mark, url, linkLabel }: CredentialCardProps) {
  const titleId = `${id}-title`;
  return (
    <article aria-labelledby={titleId} className="card-lift flex w-full flex-col bg-surface">
      <div
        aria-hidden="true"
        className="flex aspect-[4/3] items-center justify-center bg-surface-strong type-display"
      >
        {mark}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 id={titleId} className="type-lead font-semibold">
          {name}
        </h3>
        <p className="type-small text-muted">{issuer}</p>
        <ButtonLink
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          className="-ms-5 mt-auto self-start"
        >
          {linkLabel}
          <ExternalIcon />
        </ButtonLink>
      </div>
    </article>
  );
}
