import { type ContactChannels } from "@/types/contact";

export const contact: ContactChannels = {
  email: "benzartimedneji@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohamed-neji-benzarti-3951aa1bb/",
  github: "https://github.com/neji123",
  cv: "/cv/CV_Mohamed_Neji_Benzarti.pdf",
  whatsapp: { number: "21650506050", display: "+216 50 506 050" },
};

/** A WhatsApp chat with the owner, the visitor's first line already written. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
