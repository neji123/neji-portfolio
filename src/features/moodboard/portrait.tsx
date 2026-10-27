import Image from "next/image";

import { portraitImage } from "@/content/moodboard";
import { cn } from "@/lib/cn";

type PortraitProps = {
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** The transparent portrait with the light behind it; the glow colours come from the direction's tokens. */
export function Portrait({ alt, sizes, className, priority = false }: PortraitProps) {
  return (
    <div className={cn("relative isolate", className)}>
      <div
        aria-hidden="true"
        className="mb-portrait-glow absolute inset-x-[-18%] top-[2%] bottom-[18%] -z-10"
      />
      <Image
        src={portraitImage.src}
        width={portraitImage.width}
        height={portraitImage.height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className="h-full w-auto object-contain object-bottom"
      />
    </div>
  );
}
