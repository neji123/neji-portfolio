// hCaptcha through Web3Forms: the free plan verifies tokens made with Web3Forms' shared sitekey
// (custom keys are a paid feature). Enable hCaptcha in the Web3Forms dashboard to enforce it.
export const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
/** The field Web3Forms reads the token from. */
export const HCAPTCHA_FIELD = "h-captcha-response";

const ONLOAD_CALLBACK = "__nbHCaptchaReady";
const SCRIPT_URL = `https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=${ONLOAD_CALLBACK}`;

type RenderParams = {
  sitekey: string;
  /** Invisible: no checkbox; a challenge appears only when hCaptcha doubts the visitor. */
  size: "invisible";
  /** Language of the challenge (it lays itself out right to left in Arabic). */
  hl: string;
};

export type HCaptchaApi = {
  render: (container: HTMLElement, params: RenderParams) => string;
  execute: (widgetId: string, options: { async: true }) => Promise<{ response: string }>;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
    [ONLOAD_CALLBACK]?: () => void;
  }
}

let loading: Promise<HCaptchaApi> | null = null;

/** Adds hCaptcha's script once, on demand; a failed load can be retried. */
export function loadHCaptcha(): Promise<HCaptchaApi> {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha);
  loading ??= new Promise<HCaptchaApi>((resolve, reject) => {
    window[ONLOAD_CALLBACK] = () => {
      if (window.hcaptcha) resolve(window.hcaptcha);
      else reject(new Error("hcaptcha-unavailable"));
    };
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onerror = () => {
      script.remove();
      loading = null;
      reject(new Error("hcaptcha-load-failed"));
    };
    document.head.append(script);
  });
  return loading;
}

/** hCaptcha rejects with this when the visitor closes a challenge: a choice, not a failure. */
export function isChallengeClosed(error: unknown): boolean {
  return (
    error === "challenge-closed" || (error instanceof Error && error.message === "challenge-closed")
  );
}
