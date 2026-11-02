"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { FAB_AVOID_ATTRIBUTE } from "@/components/layout/whatsapp-button";
import { GLOBE_AVOID_ATTRIBUTE } from "@/components/three/globe-scenes";
import { Button } from "@/components/ui/button";
import { CheckIcon, SendIcon, SpinnerIcon } from "@/components/ui/icons";
import { contact } from "@/content/contact";
import { cn } from "@/lib/cn";
import { isChallengeClosed } from "@/lib/hcaptcha";
import {
  hasWeb3FormsKey,
  mailtoFallback,
  type SendOutcome,
  sendWithWeb3Forms,
} from "@/lib/web3forms";

import {
  CONTACT_FIELDS,
  type ContactDraft,
  type ContactErrors,
  type ContactField,
  emailSubject,
  MESSAGE_MAX,
  MESSAGE_MIN,
  SUBJECT_KEYS,
  type SubjectKey,
  validateContact,
} from "./contact-schema";
import { startCooldown, useCooldown } from "./cooldown";
import { useHCaptcha } from "./use-hcaptcha";

/** "cancelled": the visitor closed the hCaptcha challenge. */
type Status = "idle" | "sending" | "cancelled" | SendOutcome;

/** Time trap: nobody reads and fills this letter in under ten seconds; bots do. */
const MIN_FILL_MS = 10_000;

function sentTooFast(displayedAt: number | null): boolean {
  return displayedAt === null || Date.now() - displayedAt < MIN_FILL_MS;
}

const EMPTY: ContactDraft = { name: "", email: "", company: "", subject: "", message: "" };

type ContactFormProps = {
  /** The owner's name, on the letter's "To" line. */
  recipient: string;
};

/**
 * The contact form as a letter: the subject line writes itself from the chosen subject and the
 * sender's name. It validates on submit, then live; Web3Forms delivers it, and when it cannot,
 * a mailto: link carries the same letter.
 */
export function ContactForm({ recipient }: ContactFormProps) {
  const t = useTranslations("Contact.form");
  const locale = useLocale();
  const id = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  /** When the letter first showed on screen (epoch ms), for the time trap. */
  const displayedAtRef = useRef<number | null>(null);
  const coolingDown = useCooldown();
  const {
    containerRef: captchaRef,
    getToken: getCaptchaToken,
    reset: resetCaptcha,
  } = useHCaptcha(locale, hasWeb3FormsKey);
  const [draft, setDraft] = useState<ContactDraft>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const fieldId = (field: ContactField) => `${id}-${field}`;
  const errorId = (field: ContactField) => `${id}-${field}-error`;
  const subjectLabel = draft.subject ? t(`subjects.${draft.subject}`) : "";
  const subjectLine = emailSubject(subjectLabel, draft.name);
  const sending = status === "sending";
  const messageLength = draft.message.trim().length;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      displayedAtRef.current ??= Date.now();
      observer.disconnect();
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  function update(field: ContactField, value: string) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (attempted) {
      const result = validateContact(next);
      setErrors(result.success ? {} : result.errors);
    }
    if (status !== "sending") setStatus("idle");
  }

  const onText =
    (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(field, event.target.value);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || coolingDown) return;
    setAttempted(true);
    const result = validateContact(draft);
    if (!result.success) {
      setErrors(result.errors);
      const first = CONTACT_FIELDS.find((field) => result.errors[field]);
      if (first) focusField(first);
      return;
    }
    setErrors({});
    // A filled honeypot is a bot: it is told "sent" and nothing leaves the page.
    if (honeypotRef.current?.checked) {
      finish("sent");
      return;
    }
    // Too fast to be a person: the usual failure, and no hint as to why.
    if (sentTooFast(displayedAtRef.current)) {
      finish("failed");
      return;
    }
    if (!hasWeb3FormsKey) {
      finish("unavailable");
      return;
    }
    setStatus("sending");
    let token: string;
    try {
      token = await getCaptchaToken();
    } catch (error) {
      setStatus(isChallengeClosed(error) ? "cancelled" : "failed");
      return;
    }
    const outcome = await sendWithWeb3Forms({
      ...result.data,
      subject: subjectLine,
      locale,
      botcheck: false,
      hCaptchaToken: token,
    });
    // A token is good for one submission.
    resetCaptcha();
    finish(outcome);
  }

  function finish(outcome: SendOutcome) {
    setStatus(outcome);
    if (outcome !== "sent") return;
    setDraft(EMPTY);
    setAttempted(false);
    startCooldown();
  }

  function focusField(field: ContactField) {
    const target =
      field === "subject"
        ? document.querySelector<HTMLInputElement>(`input[name="${fieldId("subject")}"]`)
        : document.getElementById(fieldId(field));
    target?.focus();
  }

  const fallbackBody = [
    draft.message.trim(),
    "",
    [draft.name.trim(), draft.company.trim()].filter(Boolean).join(", "),
    draft.email.trim(),
  ].join("\n");

  return (
    <div ref={cardRef} {...{ [GLOBE_AVOID_ATTRIBUTE]: "" }} className="letter-card @container">
      {/* The envelope's header: who it goes to, and the subject it will arrive with. */}
      <div className="flex items-start justify-between gap-6 border-b border-dashed border-surface-strong pb-5">
        <dl className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 type-small">
          <dt className="text-muted">{t("to")}</dt>
          <dd className="font-medium">{recipient}</dd>
          <dt className="text-muted">{t("subjectLine")}</dt>
          <dd className={cn("truncate", draft.subject ? "text-ink" : "text-muted")}>
            {draft.subject ? subjectLine : t("subjectLineEmpty")}
          </dd>
        </dl>
        <span aria-hidden="true" className="letter-stamp" />
      </div>

      <form noValidate onSubmit={submit} aria-label={t("title")} className="mt-8 grid gap-4">
        {/* After a send the letter rests for a while (cooldown): every control is disabled. */}
        <fieldset
          disabled={coolingDown}
          className="grid min-w-0 gap-8 transition-opacity duration-(--duration-medium) ease-(--ease-smooth-out) disabled:opacity-55"
        >
          <div className="grid gap-8 @lg:grid-cols-2 @lg:gap-6">
            <TextField
              id={fieldId("name")}
              errorId={errorId("name")}
              label={t("name")}
              error={errors.name && t(`errors.${errors.name}`)}
            >
              <input
                id={fieldId("name")}
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                placeholder={t("namePlaceholder")}
                value={draft.name}
                onChange={onText("name")}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errorId("name")}
                className="letter-input"
              />
            </TextField>
            <TextField
              id={fieldId("email")}
              errorId={errorId("email")}
              label={t("email")}
              error={errors.email && t(`errors.${errors.email}`)}
            >
              <input
                id={fieldId("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                required
                aria-required="true"
                placeholder={t("emailPlaceholder")}
                value={draft.email}
                onChange={onText("email")}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errorId("email")}
                className="letter-input rtl:text-end"
              />
            </TextField>
          </div>

          <TextField
            id={fieldId("company")}
            errorId={errorId("company")}
            label={t("company")}
            hint={t("optional")}
            error={errors.company && t(`errors.${errors.company}`)}
          >
            <input
              id={fieldId("company")}
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={t("companyPlaceholder")}
              value={draft.company}
              onChange={onText("company")}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={errorId("company")}
              className="letter-input"
            />
          </TextField>

          {/* Native radios: arrow keys move the choice, Tab leaves the group. */}
          <fieldset
            role="radiogroup"
            aria-required="true"
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errorId("subject")}
            className="grid gap-3"
          >
            <legend className="mb-3 type-small font-medium">{t("subject")}</legend>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_KEYS.map((key: SubjectKey) => (
                <label key={key} className="subject-chip">
                  <input
                    type="radio"
                    name={fieldId("subject")}
                    value={key}
                    checked={draft.subject === key}
                    onChange={() => update("subject", key)}
                    className="sr-only"
                  />
                  {t(`subjects.${key}`)}
                </label>
              ))}
            </div>
            <FieldError
              id={errorId("subject")}
              message={errors.subject && t(`errors.${errors.subject}`)}
            />
          </fieldset>

          <TextField
            id={fieldId("message")}
            errorId={errorId("message")}
            label={t("message")}
            error={
              errors.message &&
              (errors.message === "messageShort"
                ? t("errors.messageShort", { min: MESSAGE_MIN })
                : t(`errors.${errors.message}`))
            }
            aside={
              <span id={`${id}-counter`} className="type-small text-muted tabular-nums">
                {messageLength < MESSAGE_MIN
                  ? t("counterMin", { remaining: MESSAGE_MIN - messageLength })
                  : t("counter", { count: messageLength, max: MESSAGE_MAX })}
              </span>
            }
          >
            <textarea
              id={fieldId("message")}
              name="message"
              rows={5}
              required
              aria-required="true"
              maxLength={MESSAGE_MAX}
              placeholder={t(`placeholders.${draft.subject || "default"}`)}
              value={draft.message}
              onChange={onText("message")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${errorId("message")} ${id}-counter`}
              className="letter-input letter-lines resize-y"
            />
          </TextField>

          {/* Honeypot (Web3Forms "botcheck"): invisible to people, tempting to bots. */}
          <input
            ref={honeypotRef}
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            aria-label={t("honeypot")}
          />
          {/* The invisible hCaptcha widget mounts here; a challenge, if any, opens over the page. */}
          <div ref={captchaRef} />

          <div {...{ [FAB_AVOID_ATTRIBUTE]: "" }} className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={sending || coolingDown}
              aria-describedby={`${id}-privacy`}
              className="disabled:cursor-progress"
            >
              {/* A new key per state, so each label arrives with the swap. */}
              <span
                key={coolingDown ? "resting" : status}
                className="state-swap inline-flex items-center gap-2"
              >
                {sending ? <SpinnerIcon /> : null}
                {coolingDown ? <CheckIcon /> : null}
                {sending ? t("sending") : coolingDown ? t("sent") : t("submit")}
                {sending || coolingDown ? null : <SendIcon />}
              </span>
            </Button>
          </div>
        </fieldset>
        <div className="grid gap-4">
          <div role="status" aria-live="polite" aria-atomic="true">
            {status === "sent" ? (
              <p key="sent" className="state-swap type-small text-ink">
                {t("success")}
              </p>
            ) : null}
            {status === "cancelled" ? (
              <p key="cancelled" className="state-swap type-small text-ink">
                {t("verifyCancelled")}
              </p>
            ) : null}
            {status === "failed" || status === "unavailable" ? (
              <p key={status} className="state-swap type-small text-danger">
                {t(status)}{" "}
                <a
                  href={mailtoFallback(contact.email, subjectLine, fallbackBody)}
                  className="font-medium text-ink"
                >
                  <span className="link-line">{t("fallback")}</span>
                </a>
              </p>
            ) : null}
          </div>
          {coolingDown ? <p className="type-small text-muted">{t("cooldown")}</p> : null}
          <p id={`${id}-privacy`} className="type-small text-muted">
            {t("privacy")} {/* hCaptcha asks for this notice when its widget is invisible. */}
            {t.rich("captchaNotice", {
              privacy: (chunks) => (
                <NoticeLink href="https://www.hcaptcha.com/privacy">{chunks}</NoticeLink>
              ),
              terms: (chunks) => (
                <NoticeLink href="https://www.hcaptcha.com/terms">{chunks}</NoticeLink>
              ),
            })}
          </p>
        </div>
      </form>
    </div>
  );
}

function NoticeLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline transition-colors duration-(--duration-fast) ease-(--ease-smooth-out) hover:text-ink"
    >
      {children}
    </a>
  );
}

type TextFieldProps = {
  id: string;
  errorId: string;
  label: string;
  hint?: string;
  error?: string;
  /** Sits at the end of the error line (the message counter). */
  aside?: ReactNode;
  children: ReactNode;
};

function TextField({ id, errorId, label, hint, error, aside, children }: TextFieldProps) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-4 type-small font-medium"
      >
        {label}
        {hint ? <span className="font-normal text-muted">{hint}</span> : null}
      </label>
      {children}
      <div className="flex items-start justify-between gap-4">
        <FieldError id={errorId} message={error} />
        {aside}
      </div>
    </div>
  );
}

/** Always in the page, so a new error is announced when it appears. */
function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} aria-live="polite" className="type-small text-danger">
      {message}
    </p>
  );
}
