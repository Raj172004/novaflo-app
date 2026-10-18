import { z } from 'zod';

/**
 * Shared Zod schemas for public lead forms. Both forms are validated with the
 * exact same rules on submit, so the browser never trusts its own input and
 * the tests exercise the identical rules the UI enforces.
 */

const nameField = z
  .string()
  .trim()
  .min(2, 'Please enter your name.')
  .max(120, 'Name is too long.');

const emailField = z
  .string()
  .trim()
  .min(1, 'Please enter your email.')
  .email('Please enter a valid email.')
  .max(254, 'Email is too long.');

const phoneField = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || v.replace(/\D/g, '').length >= 10,
    'Please enter a valid phone number.'
  );

const messageField = z
  .string()
  .trim()
  .min(10, 'Please tell us a little more (10+ characters).')
  .max(5000, 'Message is too long.');

/** Honeypot: must stay empty — any value means a bot filled the form. */
const honeypot = z.literal('', { message: 'Submission rejected.' });

export const contactSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    subject: z.string().trim().max(200, 'Subject is too long.'),
    message: messageField,
    website: honeypot,
  })
  .strict();

export const growthCallSchema = z
  .object({
    name: nameField,
    email: emailField,
    phone: phoneField,
    businessName: z.string().trim().max(160, 'Business name is too long.'),
    businessType: z.string().trim().max(120, 'Business type is too long.'),
    serviceArea: z.string().trim().max(120, 'Service area is too long.'),
    serviceInterest: z.string().trim().max(160),
    goals: z.string().trim().max(5000, 'Goals description is too long.'),
    budget: z.string().trim().max(80),
    timeline: z.string().trim().max(80),
    website: honeypot,
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
export type GrowthCallInput = z.infer<typeof growthCallSchema>;

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/** Flatten a ZodError into a per-field error map for the forms. */
export function zodErrors<T extends Record<string, unknown>>(
  error: z.ZodError<T>
): FormErrors<T> {
  const out: FormErrors<T> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in out)) {
      out[key as keyof T] = issue.message;
    }
  }
  return out;
}
