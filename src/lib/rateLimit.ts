const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS = 3;
const STORAGE_KEY = 'novaflo_lead_timestamps';

interface Timestamps {
  growth_call: number[];
  contact: number[];
}

function read(): Timestamps {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Timestamps) : { growth_call: [], contact: [] };
  } catch {
    return { growth_call: [], contact: [] };
  }
}

function write(data: Timestamps) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable; limiting degrades gracefully
  }
}

/**
 * Client-side rate limiting for public lead forms. Returns true when the
 * submission is allowed and records it; false when the caller is over the limit.
 * The server remains the authority — this simply stops obvious floods early.
 */
export function allowSubmission(type: 'growth_call' | 'contact'): boolean {
  const now = Date.now();
  const data = read();
  const recent = (data[type] ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_SUBMISSIONS) {
    return false;
  }
  recent.push(now);
  write({ ...data, [type]: recent });
  return true;
}
