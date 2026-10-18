const STORAGE_KEY = 'novaflo_attribution';

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
}

export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const stored = readStored();

  const fresh: Attribution = {
    utm_source: params.get('utm_source') ?? stored.utm_source,
    utm_medium: params.get('utm_medium') ?? stored.utm_medium,
    utm_campaign: params.get('utm_campaign') ?? stored.utm_campaign,
    utm_term: params.get('utm_term') ?? stored.utm_term,
    utm_content: params.get('utm_content') ?? stored.utm_content,
  };

  const hasUtm = params.get('utm_source') !== null;
  const value: Attribution = hasUtm
    ? { ...fresh, referrer: document.referrer || stored.referrer }
    : stored;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // storage unavailable; attribution simply not persisted
  }
  return value;
}

function readStored(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function clearAttribution() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
