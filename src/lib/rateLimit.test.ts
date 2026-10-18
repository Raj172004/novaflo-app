import { describe, it, expect, beforeEach } from 'vitest';
import { allowSubmission } from './rateLimit';

describe('allowSubmission (client-side rate limiting)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows submissions under the limit', () => {
    expect(allowSubmission('contact')).toBe(true);
    expect(allowSubmission('contact')).toBe(true);
  });

  it('blocks after three submissions within the window', () => {
    allowSubmission('contact');
    allowSubmission('contact');
    allowSubmission('contact');
    expect(allowSubmission('contact')).toBe(false);
  });

  it('tracks each form type independently', () => {
    allowSubmission('contact');
    allowSubmission('contact');
    allowSubmission('contact');
    expect(allowSubmission('contact')).toBe(false);
    expect(allowSubmission('growth_call')).toBe(true);
  });

  it('allows again after the window expires', () => {
    allowSubmission('growth_call');
    allowSubmission('growth_call');
    allowSubmission('growth_call');
    expect(allowSubmission('growth_call')).toBe(false);

    // Simulate the window passing.
    const raw = localStorage.getItem('novaflo_lead_timestamps');
    const data = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const shifted = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v.map((t) => t - 61_000)])
    );
    localStorage.setItem('novaflo_lead_timestamps', JSON.stringify(shifted));

    expect(allowSubmission('growth_call')).toBe(true);
  });
});
