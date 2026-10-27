import Image from "next/image";

import { portrait } from "@/content/media";
import { cn } from "@/lib/cn";

type PortraitProps = {
  alt: string;
  sizes: string;
  className?: string;
};

/** The transparent portrait, lit from behind by the night-route glow (owner requirement). */
export function Portrait({ alt, sizes, className }: PortraitProps) {
  return (
    <div className={cn("relative isolate", className)}>
      <div
        aria-hidden="true"
        className="portrait-glow absolute inset-x-[-18%] top-[2%] bottom-[18%] -z-10"
      />
      <Image
        src={portrait.src}
        width={portrait.width}
        height={portrait.height}
        alt={alt}
        sizes={sizes}
        className="h-full w-auto object-contain object-bottom"
      />
    </div>
  );
}
