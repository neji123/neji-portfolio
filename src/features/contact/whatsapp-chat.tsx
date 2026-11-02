"use client";

import { WhatsAppIcon } from "@/components/ui/icons";
import { openWhatsApp } from "@/lib/whatsapp";

type WhatsAppChatProps = {
  /** "Chat on WhatsApp". */
  label: string;
  /** The visitor's first line, in their language. */
  message: string;
};

/** The Contact section's WhatsApp option: a real button; the chat link exists only on click. */
export function WhatsAppChat({ label, message }: WhatsAppChatProps) {
  return (
    <button
      type="button"
      onClick={() => openWhatsApp(message)}
      className="-mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 type-body"
    >
      <span className="grid size-8 place-items-center rounded-full bg-whatsapp text-white">
        <WhatsAppIcon className="size-4.5" />
      </span>
      <span className="link-line">{label}</span>
    </button>
  );
}
