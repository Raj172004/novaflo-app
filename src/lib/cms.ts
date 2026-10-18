import { supabase } from '@/lib/supabase';

export interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: 'target' | 'pen' | 'calendar' | 'video' | 'search' | 'megaphone';
  sort_order: number;
  published: boolean;
}

export interface InsightRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  published: boolean;
  created_at: string;
}

const STATIC_SERVICES: ServiceRecord[] = [
  {
    id: 'static-strategy',
    slug: 'social-media-strategy',
    name: 'Social Media Strategy',
    tagline: 'A plan built around your business, not templates.',
    description:
      'We map your audience, competitors and positioning into a clear content strategy — what to post, where to post it, and why it converts.',
    deliverables: [
      'Audience & competitor research',
      'Positioning & messaging framework',
      'Platform selection & posting cadence',
      'Content pillar roadmap (90 days)',
    ],
    icon: 'target',
    sort_order: 1,
    published: true,
  },
  {
    id: 'static-content',
    slug: 'content-creation',
    name: 'Content Creation',
    tagline: 'Posts your customers actually stop for.',
    description:
      'Reels, carousels, stories and static posts designed and written for your brand — planned, produced and delivered on a schedule you approve.',
    deliverables: [
      'Monthly content calendar',
      'Reels & short-form video edits',
      'Carousel & static post design',
      'Captions and hashtags written for you',
    ],
    icon: 'pen',
    sort_order: 2,
    published: true,
  },
  {
    id: 'static-calendar',
    slug: 'content-calendar-management',
    name: 'Content Calendar & Management',
    tagline: 'Consistency without you lifting a finger.',
    description:
      'We plan, schedule and publish across your channels, keeping every post on-brand and on-time so your presence never goes quiet.',
    deliverables: [
      'Scheduling & publishing handled end-to-end',
      'Monthly planning calls',
      'Approval workflow before anything goes live',
      'Performance recap every month',
    ],
    icon: 'calendar',
    sort_order: 3,
    published: true,
  },
  {
    id: 'static-reels',
    slug: 'reels-video-editing',
    name: 'Reels & Video Editing',
    tagline: 'Short-form video that earns attention.',
    description:
      'From raw footage to polished reels: hooks, cuts, captions, music and covers — edited to keep viewers watching to the end.',
    deliverables: [
      'Hook scripting & structure',
      'Professional edits with captions',
      'Cover design & posting copy',
      'Two revision rounds per video',
    ],
    icon: 'video',
    sort_order: 4,
    published: true,
  },
  {
    id: 'static-seo',
    slug: 'local-seo-discovery',
    name: 'Local SEO & Discovery',
    tagline: 'Get found by people nearby who are ready to buy.',
    description:
      'Profile optimization, keywords and geo-targeted content so when someone searches for your service in your city, your business is the obvious answer.',
    deliverables: [
      'Google Business Profile optimization',
      'Local keyword targeting',
      'Review & reputation guidance',
      'Geo-tagged content plan',
    ],
    icon: 'search',
    sort_order: 5,
    published: true,
  },
  {
    id: 'static-boosts',
    slug: 'paid-boosts',
    name: 'Paid Boosts & Promotions',
    tagline: 'Small budgets, strategically amplified.',
    description:
      'We boost the posts that already work and run tightly targeted local promotions — measured on leads, not vanity metrics.',
    deliverables: [
      'Audience & geo targeting setup',
      'Creative testing plan',
      'Weekly budget monitoring',
      'Clear reporting on cost per lead',
    ],
    icon: 'megaphone',
    sort_order: 6,
    published: true,
  },
];

const STATIC_INSIGHTS: InsightRecord[] = [
  {
    id: 'static-insight-1',
    slug: 'why-posting-daily-is-not-a-strategy',
    title: 'Why posting daily is not a strategy',
    excerpt:
      'Volume without direction burns you out and trains the algorithm to ignore you. Here is how to think about cadence versus consistency.',
    content:
      'Every business owner has heard it: "you have to post every day." It sounds like discipline. In practice, it is often the fastest route to burnout and a feed nobody watches.\n\nThe platforms do not reward volume. They reward signals — saves, shares, watch time, comments. A daily post that gets none of those teaches the algorithm your content is not worth showing. Three strong posts a week that consistently earn saves will outperform seven forgettable ones every single time.\n\nThe fix is to think in terms of consistency, not cadence. Pick a rhythm you can sustain for a year, not a month. Build three to five content pillars that map to what your customers actually care about. Then measure every post against those pillars: did it build trust, show proof, or make an offer?\n\nDaily posting is a tactic, not a strategy. The strategy is the story you are telling — and a story told three times a week, well, beats one told daily, badly.',
    category: 'Strategy',
    read_time: '5 min',
    published: true,
    created_at: '2026-09-12T00:00:00Z',
  },
  {
    id: 'static-insight-2',
    slug: 'the-3-content-pillars-every-local-business-needs',
    title: 'The 3 content pillars every local business needs',
    excerpt:
      'Trust, proof and offer. Most businesses post only offers — and wonder why nobody engages. A simple framework to balance your feed.',
    content:
      'Open the Instagram feed of a typical local business and you will find a wall of offers: discounts, deals, promotions. Followed by silence. Offers-only feeds fail because they ask for the sale before earning the trust.\n\nA healthy feed balances three pillars. Trust content teaches — answer the questions your customers actually ask, demystify your process, show the faces behind the business. Proof content demonstrates — before/afters, results, reviews, work in progress. Offer content asks — a clear invitation with a reason to act now.\n\nA simple split that works for most local businesses: 40 percent trust, 40 percent proof, 20 percent offers. If you feel like you are giving away too much for free, you are probably doing it right.\n\nAudit your last twelve posts against this split. Most businesses discover they are at 80 percent offers. Rebalancing is the single fastest way to lift engagement — no new equipment, no new budget, just a better mix.',
    category: 'Content',
    read_time: '4 min',
    published: true,
    created_at: '2026-08-28T00:00:00Z',
  },
  {
    id: 'static-insight-3',
    slug: 'reels-hooks-the-first-2-seconds-decide-everything',
    title: 'Reels hooks: the first 2 seconds decide everything',
    excerpt:
      'A practical breakdown of hook patterns that stop the scroll for local businesses — with examples you can adapt this week.',
    content:
      'Eighty percent of viewers who will ever drop off, drop off in the first two seconds. That is not a reason to panic — it is a design constraint. The hook is not decoration; it is the gate everything else depends on.\n\nThe patterns that consistently work for local businesses share one quality: they open a question the viewer needs answered. "This is why your dosa never tastes like the restaurant version." "Three things every salon does wrong with walk-in clients." "We renovated this shop for under fifty thousand — here is the breakdown."\n\nNotice these are not flashy. No zooms, no sound effects. They work because they name a specific person and a specific problem. Specificity beats spectacle.\n\nPractical rules: start mid-action, never with a logo or a greeting. Put the payoff promise in the first line of on-screen text. Cut anything in the first three seconds that does not earn the next three. And rewrite your hook after filming — the best hook is usually one line from the middle of your raw footage.',
    category: 'Video',
    read_time: '6 min',
    published: true,
    created_at: '2026-08-10T00:00:00Z',
  },
  {
    id: 'static-insight-4',
    slug: 'how-to-get-reviews-without-begging',
    title: 'How to get reviews without begging',
    excerpt:
      'A respectful, repeatable system for earning Google reviews that boost your local discovery — and what to never do.',
    content:
      'Ask any local business owner about reviews and you get the same story: they know reviews matter, they feel awkward asking, and so most happy customers walk out silently — while the one dissatisfied customer writes a paragraph.\n\nThe fix is a system, not courage. First, pick the moment: the peak of satisfaction, right after a delighted customer says thank you or compliments the work. That is your window. Second, make it effortless: a QR code at the counter or a direct link sent by message. Never "search for us on Google" — that is a funnel with leaks. Third, personalize: "Would you mind sharing that as a review? It genuinely helps a small business like ours." Honest beats pushy.\n\nWhat never to do: never buy reviews, never incentivize them, never ask staff to write them. Platforms detect it, and one penalty erases years of reputation. And respond to every review — including the critical ones. A calm, professional response to a complaint often does more for your reputation than ten five-star reviews.',
    category: 'Local SEO',
    read_time: '4 min',
    published: true,
    created_at: '2026-07-22T00:00:00Z',
  },
];

export async function getServices(): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return STATIC_SERVICES;
  return data as ServiceRecord[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceRecord | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getInsights(): Promise<InsightRecord[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return STATIC_INSIGHTS;
  return data as InsightRecord[];
}

export async function getInsightBySlug(slug: string): Promise<InsightRecord | null> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) {
    return STATIC_INSIGHTS.find((i) => i.slug === slug) ?? null;
  }
  return data as InsightRecord;
}
