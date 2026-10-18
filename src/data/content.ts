export interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: 'target' | 'pen' | 'calendar' | 'video' | 'search' | 'megaphone';
}

export const SERVICES: Service[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const PROCESS: ProcessStep[] = [
  {
    step: '01',
    title: 'Growth Call',
    description:
      'A focused 30-minute call to understand your business, your customers and where growth is actually blocked. No pitch decks, no pressure.',
  },
  {
    step: '02',
    title: 'Growth Plan',
    description:
      'You receive a clear, written plan: what we will post, on which platforms, how often — and what results to realistically expect.',
  },
  {
    step: '03',
    title: 'Build & Approve',
    description:
      'We produce the first month of content. You review and approve everything before a single post goes live.',
  },
  {
    step: '04',
    title: 'Publish & Grow',
    description:
      'Content ships on schedule. We monitor what resonates, double down on winners and report progress in plain language every month.',
  },
];

export interface Industry {
  name: string;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    name: 'Restaurants & Cafés',
    description: 'Fill tables with mouth-watering reels, offers and local discovery.',
  },
  {
    name: 'Salons & Studios',
    description: 'Turn your best work into a booking machine with before/after content.',
  },
  {
    name: 'Clinics & Wellness',
    description: 'Build trust with educational content that answers real patient questions.',
  },
  {
    name: 'Retail & Boutiques',
    description: 'Showcase arrivals and offers that drive footfall to your store.',
  },
  {
    name: 'Real Estate',
    description: 'Property walkthroughs and area guides that attract serious buyers.',
  },
  {
    name: 'Fitness & Coaching',
    description: 'Transformations and tips that convert followers into members.',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: 'How soon will I see results?',
    answer:
      'Consistency compounds. Most businesses see meaningful engagement improvement within the first 60–90 days of a steady, strategic posting rhythm. We set honest expectations in your growth plan — no promises of virality or overnight followers.',
  },
  {
    question: 'Do I have to appear on camera?',
    answer:
      'No. Many of our best-performing content formats are product, process and design-led. If you are comfortable on camera we will use that — if not, we build content that does not need you.',
  },
  {
    question: 'What platforms do you manage?',
    answer:
      'Primarily Instagram, Facebook and Google Business Profile — the platforms that matter most for local and growing businesses. We recommend platforms based on where your customers actually are, not where the trend is.',
  },
  {
    question: 'Do you work with businesses outside Anantapur?',
    answer:
      'Yes. We started in Anantapur and nearby service areas, and we work with growing businesses remotely across India. Local discovery work is geo-targeted to your specific area.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Every plan is scoped to your goals and content volume. After your growth call you receive a written plan with clear pricing — no hidden fees, and you approve everything before we start.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. We work month-to-month. If the partnership is not working, you can stop — we hand over all content, accounts and assets cleanly.',
  },
];

export interface Insight {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  date: string;
}

export const INSIGHTS: Insight[] = [
  {
    title: 'Why posting daily is not a strategy',
    excerpt:
      'Volume without direction burns you out and trains the algorithm to ignore you. Here is how to think about cadence versus consistency.',
    readTime: '5 min',
    category: 'Strategy',
    date: '2026-09-12',
  },
  {
    title: 'The 3 content pillars every local business needs',
    excerpt:
      'Trust, proof and offer. Most businesses post only offers — and wonder why nobody engages. A simple framework to balance your feed.',
    readTime: '4 min',
    category: 'Content',
    date: '2026-08-28',
  },
  {
    title: 'Reels hooks: the first 2 seconds decide everything',
    excerpt:
      'A practical breakdown of hook patterns that stop the scroll for local businesses — with examples you can adapt this week.',
    readTime: '6 min',
    category: 'Video',
    date: '2026-08-10',
  },
  {
    title: 'How to get reviews without begging',
    excerpt:
      'A respectful, repeatable system for earning Google reviews that boost your local discovery — and what to never do.',
    readTime: '4 min',
    category: 'Local SEO',
    date: '2026-07-22',
  },
];

export const TIMELINE_MILESTONES = [
  { week: 'Week 1', label: 'Discovery & strategy' },
  { week: 'Week 2', label: 'First content batch ready' },
  { week: 'Week 3', label: 'Publishing begins' },
  { week: 'Week 4', label: 'First performance recap' },
];

export const BUDGET_OPTIONS = [
  'Not sure yet',
  'Under ₹10,000 / month',
  '₹10,000 – ₹25,000 / month',
  '₹25,000 – ₹50,000 / month',
  'Above ₹50,000 / month',
];

export const TIMELINE_OPTIONS = ['ASAP', 'Within a month', '1–3 months', 'Just exploring'];
