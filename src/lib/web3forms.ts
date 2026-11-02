// Web3Forms delivers the contact form to the owner's inbox: no backend, nothing stored here.
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Inlined at build time; without it the form offers the mailto fallback. */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const REQUEST_TIMEOUT_MS = 15_000;

export type Web3FormsMessage = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  locale: string;
  /** The honeypot's state: Web3Forms rejects a submission where it is set. */
  botcheck: boolean;
};

/** "unavailable": no access key in this build. "failed": the request did not go through. */
export type SendOutcome = "sent" | "failed" | "unavailable";

type Web3FormsResponse = { success?: boolean };

export async function sendWithWeb3Forms(message: Web3FormsMessage): Promise<SendOutcome> {
  if (!ACCESS_KEY) return "unavailable";
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        from_name: "Portfolio",
        replyto: message.email,
        ...message,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const body = (await response.json()) as Web3FormsResponse;
    return response.ok && body.success === true ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/** A mailto: link carrying the same subject and message, for when the form cannot send. */
export function mailtoFallback(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
