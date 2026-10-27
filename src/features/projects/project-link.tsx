import { ButtonLink } from "@/components/ui/button";
import { ExternalIcon } from "@/components/ui/icons";

type ProjectLinkProps = {
  url: string;
  label: string;
};

export function ProjectLink({ url, label }: ProjectLinkProps) {
  return (
    <ButtonLink href={url} target="_blank" rel="noopener noreferrer" className="self-start">
      {label}
      <ExternalIcon />
    </ButtonLink>
  );
}
