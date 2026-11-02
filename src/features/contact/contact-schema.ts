import * as z from "zod/mini";

/** The subjects a visitor can pick, in display order. Labels live in messages (Contact.form.subjects). */
export const SUBJECT_KEYS = [
  "freelance",
  "fullTime",
  "opportunity",
  "collaboration",
  "consultation",
  "other",
] as const;

export type SubjectKey = (typeof SUBJECT_KEYS)[number];

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 3000;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const COMPANY_MAX = 120;

/** Every message is a key of Contact.form.errors, so the schema stays language-free. */
export type ContactErrorCode =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "subjectRequired"
  | "messageRequired"
  | "messageShort"
  | "tooLong";

const contactSchema = z.object({
  name: z
    .string()
    .check(z.trim(), z.minLength(1, "nameRequired"), z.maxLength(NAME_MAX, "tooLong")),
  email: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "emailRequired"),
      z.email("emailInvalid"),
      z.maxLength(EMAIL_MAX, "tooLong"),
    ),
  company: z.string().check(z.trim(), z.maxLength(COMPANY_MAX, "tooLong")),
  subject: z.enum(SUBJECT_KEYS, "subjectRequired"),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "messageRequired"),
      z.minLength(MESSAGE_MIN, "messageShort"),
      z.maxLength(MESSAGE_MAX, "tooLong"),
    ),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactValues;
/** What the form holds before validation: the subject may still be unchosen. */
export type ContactDraft = Omit<ContactValues, "subject"> & { subject: SubjectKey | "" };
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** Field order, so the first invalid field can take focus. */
export const CONTACT_FIELDS: readonly ContactField[] = [
  "name",
  "email",
  "company",
  "subject",
  "message",
];

export type ContactValidation =
  { success: true; data: ContactValues } | { success: false; errors: ContactErrors };

export function validateContact(draft: ContactDraft): ContactValidation {
  const result = contactSchema.safeParse(draft);
  if (result.success) return { success: true, data: result.data };
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    // The first failing check of a field is the one worth saying.
    errors[field] ??= issue.message as ContactErrorCode;
  }
  return { success: false, errors };
}

const SUBJECT_PREFIX = "[Portfolio]";

/** "[Portfolio] Freelance project: Jane Doe": the subject the email arrives with. */
export function emailSubject(subjectLabel: string, name: string): string {
  const who = name.trim();
  if (!subjectLabel) return SUBJECT_PREFIX;
  return who ? `${SUBJECT_PREFIX} ${subjectLabel}: ${who}` : `${SUBJECT_PREFIX} ${subjectLabel}`;
}
