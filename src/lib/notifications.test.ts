import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notifyNewLead, type LeadNotificationPayload } from './notifications';

function payload(overrides: Partial<LeadNotificationPayload> = {}): LeadNotificationPayload {
  return {
    type: 'contact',
    name: 'Test User',
    email: 'test@example.com',
    phone: null,
    company: null,
    serviceInterest: null,
    message: 'Hello',
    budget: null,
    timeline: null,
    serviceArea: null,
    submittedAt: new Date().toISOString(),
    pageUrl: 'https://novaflo.example/contact',
    ...overrides,
  };
}

describe('notifyNewLead', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Spy replaces globalThis.fetch synchronously before any notifyNewLead call.
    fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubEnv('VITE_GOOGLE_SHEETS_WEBHOOK_URL', 'https://script.google.com/macros/s/test/exec');
    vi.stubEnv('VITE_NOTIFICATION_EMAIL', 'rajesh.c.fullstack@gmail.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('fires a POST to the configured webhook with the lead fields', async () => {
    notifyNewLead(payload());

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('script.google.com');
    expect(init.method).toBe('POST');
    const body = JSON.parse(String(init.body));
    expect(body.type).toBe('contact');
    expect(body.name).toBe('Test User');
    expect(body.email).toBe('test@example.com');
    expect(body.message).toBe('Hello');
  });

  it('never throws when the webhook is unreachable', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    expect(() => notifyNewLead(payload())).not.toThrow();

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  it('includes the notification email target when configured', async () => {
    notifyNewLead(payload());

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    // The Apps Script relays to this inbox via Gmail SMTP.
    expect(body.notificationEmail).toBe('rajesh.c.fullstack@gmail.com');
  });
});
