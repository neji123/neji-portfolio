// Web3Forms delivers the contact form to the owner's inbox: no backend, nothing stored here.
import { HCAPTCHA_FIELD } from "@/lib/hcaptcha";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Inlined at build time; without it the form offers the mailto fallback. */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
export const hasWeb3FormsKey = Boolean(ACCESS_KEY);
const REQUEST_TIMEOUT_MS = 15_000;

export type Web3FormsMessage = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  locale: string;
  /** The invisible hCaptcha's token, verified by Web3Forms; null on the local dev server. */
  hCaptchaToken: string | null;
};

/** "unavailable": no access key in this build. "failed": the request did not go through. */
export type SendOutcome = "sent" | "failed" | "unavailable";

type Web3FormsResponse = { success?: boolean };

export async function sendWithWeb3Forms({
  hCaptchaToken,
  ...message
}: Web3FormsMessage): Promise<SendOutcome> {
  if (!ACCESS_KEY) return "unavailable";
  try {
    // FormData, as in the Web3Forms docs: the browser sets the multipart header itself.
    const body = new FormData();
    body.append("access_key", ACCESS_KEY);
    body.append("from_name", "Portfolio");
    body.append("replyto", message.email);
    for (const [field, value] of Object.entries(message)) body.append(field, value);
    // An unchecked honeypot sends nothing, like an unchecked checkbox (a filled one never gets here).
    if (hCaptchaToken) body.append(HCAPTCHA_FIELD, hCaptchaToken);
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const result = (await response.json()) as Web3FormsResponse;
    return response.ok && result.success === true ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** A mailto: link carrying the same subject and message, for when the form cannot send. */
export function mailtoFallback(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
