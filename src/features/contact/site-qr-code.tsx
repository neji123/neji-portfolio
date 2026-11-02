import { create } from "qrcode";

/** Modules of empty margin around the code, as the QR specification asks for. */
const QUIET_ZONE = 4;
const TILE_RADIUS = 2;
// Literal colours (ink tile, night modules), so a downloaded file keeps them outside the page.
const TILE_COLOR = "#eef0ea";
const MODULE_COLOR = "#0c1a2c";

type SiteQrCodeProps = {
  url: string;
  /** Id of the <svg>, so the download control can find and save it. */
  id: string;
  label: string;
  className?: string;
};

/**
 * Rendered on the server at build time: an inline SVG (no image request, sharp at any size),
 * night modules on a light rounded tile, the quiet zone kept so it scans reliably.
 */
export function SiteQrCode({ url, id, label, className }: SiteQrCodeProps) {
  const { modules } = create(url, { errorCorrectionLevel: "M" });
  const side = modules.size + QUIET_ZONE * 2;
  let path = "";
  for (let row = 0; row < modules.size; row += 1) {
    for (let column = 0; column < modules.size; column += 1) {
      if (modules.get(row, column)) path += `M${column + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`;
    }
  }

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${side} ${side}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={side} height={side} rx={TILE_RADIUS} fill={TILE_COLOR} />
      <path d={path} fill={MODULE_COLOR} />
    </svg>
  );
}
