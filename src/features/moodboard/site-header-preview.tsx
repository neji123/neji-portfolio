import { cn } from "@/lib/cn";
import { type NavCopy } from "@/types/moodboard";

const CV_HREF = "/cv/CV_Mohamed_Neji_Benzarti.pdf";

type SiteHeaderPreviewProps = {
  name: string;
  nav: NavCopy;
  label: string;
  buttonClassName: string;
  className?: string;
};

/** The site's plain bar as it will look: wordmark, the section links, one action. */
export function SiteHeaderPreview({
  name,
  nav,
  label,
  buttonClassName,
  className,
}: SiteHeaderPreviewProps) {
  return (
    <div
      className={cn(
        "mb-step-small flex items-center justify-between gap-6 px-6 py-4 md:px-10",
        className,
      )}
    >
      <p className="font-semibold">{name}</p>
      <nav aria-label={label} className="hidden lg:block">
        <ul className="flex gap-7">
          {nav.links.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
      </nav>
      <a href={CV_HREF} download className={cn("mb-button", buttonClassName)}>
        {nav.downloadCv}
      </a>
    </div>
  );
}
