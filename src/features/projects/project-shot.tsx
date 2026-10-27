import Image from "next/image";

import { Tilt } from "@/components/motion/tilt";
import { type ImageAsset } from "@/types/localized";

type ProjectShotProps = {
  image: ImageAsset;
  alt: string;
  sizes: string;
};

/** The live site's first screen, tilting toward the pointer like a print held up to the light. */
export function ProjectShot({ image, alt, sizes }: ProjectShotProps) {
  return (
    <Tilt className="bg-surface-strong">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        sizes={sizes}
        className="block h-auto w-full"
      />
    </Tilt>
  );
}
