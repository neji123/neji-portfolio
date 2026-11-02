"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";

/** Pixels per side of the PNG: large enough for print on a CV or a business card. */
const PNG_SIZE = 1200;

type QrDownloadProps = {
  /** Id of the QR code's <svg> in the page. */
  svgId: string;
  fileName: string;
  labels: { svg: string; png: string };
};

function save(href: string, fileName: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();
}

function svgBlob(svg: SVGSVGElement): Blob {
  return new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
}

/** Saves the QR code already in the page, as vector or as a print-size PNG. No library. */
export function QrDownload({ svgId, fileName, labels }: QrDownloadProps) {
  function svgElement(): SVGSVGElement | null {
    const element = document.getElementById(svgId);
    return element instanceof SVGSVGElement ? element : null;
  }

  function downloadSvg() {
    const svg = svgElement();
    if (!svg) return;
    const url = URL.createObjectURL(svgBlob(svg));
    save(url, `${fileName}.svg`);
    URL.revokeObjectURL(url);
  }

  function downloadPng() {
    const svg = svgElement();
    if (!svg) return;
    const url = URL.createObjectURL(svgBlob(svg));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PNG_SIZE;
      canvas.height = PNG_SIZE;
      const context = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!context) return;
      // Hard module edges: no smoothing when the vector is drawn large.
      context.imageSmoothingEnabled = false;
      context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        save(pngUrl, `${fileName}.png`);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    image.src = url;
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Button variant="ghost" onClick={downloadSvg} aria-label={labels.svg} className="-ms-3">
        <DownloadIcon />
        SVG
      </Button>
      <Button variant="ghost" onClick={downloadPng} aria-label={labels.png}>
        <DownloadIcon />
        PNG
      </Button>
    </div>
  );
}
