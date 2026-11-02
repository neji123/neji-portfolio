// Scrapers read markup: the number and the chat address are never in the HTML or the React
// payload. Only client code imports this file, and the link is assembled at the moment of a click.
// (The number is in the CV PDF by the owner's choice.)
const NUMBER_PARTS = ["216", "50", "506", "050"] as const;
const HOST_PARTS = ["wa", "me"] as const;

/** Opens a WhatsApp chat with the owner in a new tab, the visitor's first line already written. */
export function openWhatsApp(message: string) {
  const url = `https://${HOST_PARTS.join(".")}/${NUMBER_PARTS.join("")}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
