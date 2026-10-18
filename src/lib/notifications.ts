/**
 * Dual notification pipeline for new leads.
 *
 * When a lead is saved, two things happen in the background:
 *  1. A POST to a Google Apps Script webhook, which appends the lead to a
 *     Google Sheet (GOOGLE_SHEETS_WEBHOOK_URL).
 *  2. The same webhook (or a dedicated one) forwards an email alert to the
 *     agency inbox (GMAIL_USER / NOTIFICATION_EMAIL) through Gmail SMTP.
 *
 * Both targets are optional: if the env vars are not configured, the calls
 * are skipped silently and the lead still saves to the database. Notifications
 * never block or fail the visitor's form submission.
 *
 * NOTE (browser context): this module runs in the visitor's browser, so
 * secrets never appear in this code. The Google Apps Script webhook is a
 * public endpoint by design (it is the zero-cost approach the project uses
 * in place of a server); keep its URL unguessable and restrict the script to
 * accept POSTs with the expected payload shape.
 */

const SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string | undefined;
const NOTIFICATION_EMAIL = import.meta.env.VITE_NOTIFICATION_EMAIL as string | undefined;

export interface LeadNotificationPayload {
  type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceInterest: string | null;
  message: string | null;
  budget: string | null;
  timeline: string | null;
  serviceArea: string | null;
  submittedAt: string;
  pageUrl: string;
}

async function postWebhook(payload: LeadNotificationPayload): Promise<void> {
  if (!SHEETS_WEBHOOK_URL) return;
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      // Apps Script webhooks do not support preflighted CORS for custom
      // content types in all deployment modes; text/plain keeps it simple-past
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Never let notification failures break the lead capture UX.
  }
}

export function notifyNewLead(payload: LeadNotificationPayload): void {
  const body = {
    ...payload,
    notificationEmail: NOTIFICATION_EMAIL ?? null,
  };
  // Fire-and-forget: both the Sheet log and the email alert are handled
  // by the Apps Script webhook (which relays to Gmail SMTP server-side).
  void postWebhook(body);
}
