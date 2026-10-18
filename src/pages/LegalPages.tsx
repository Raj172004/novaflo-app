import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';

interface Section {
  heading: string;
  body: string[];
}

const PRIVACY: Section[] = [
  {
    heading: 'Information we collect',
    body: [
      'When you submit a form on this website, we collect the details you provide: your name, email address, phone number, business information and anything you choose to tell us about your goals or requirements.',
      'We also collect basic technical attribution data, such as the referring website and campaign parameters, to understand which channels bring visitors to us.',
    ],
  },
  {
    heading: 'How we use your information',
    body: [
      'We use your information solely to respond to your enquiry, prepare for your growth call, and — if we work together — deliver our services.',
      'We do not sell, rent or share your personal information with third parties for their marketing purposes.',
    ],
  },
  {
    heading: 'Data retention & security',
    body: [
      'Your details are stored securely and retained only as long as needed to serve you or as required by law. You may ask us to correct or delete your information at any time by contacting us.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You have the right to access, correct or request deletion of the personal data we hold about you. Reach out through the contact page and we will act on verified requests promptly.',
    ],
  },
];

const TERMS: Section[] = [
  {
    heading: 'Use of this website',
    body: [
      'The content on this website is provided for general information about Novaflo and its services. By using this website you agree to use it lawfully and not to misuse any forms or systems.',
    ],
  },
  {
    heading: 'Services & engagements',
    body: [
      'Descriptions of services on this website are illustrative. The exact scope, deliverables, pricing and timelines of any engagement are defined in a written agreement signed before work begins.',
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      'All content, branding and materials on this website belong to Novaflo unless otherwise stated. You may not reproduce or reuse them without written permission.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'To the fullest extent permitted by law, Novaflo is not liable for indirect or consequential losses arising from use of this website. Our liability, where it exists, is limited to fees paid for the relevant service.',
    ],
  },
];

const DISCLAIMER: Section[] = [
  {
    heading: 'No guaranteed results',
    body: [
      'Social media outcomes depend on many factors outside any agency\'s control, including platform algorithms, market conditions and your own operations. Novaflo does not guarantee follower counts, virality, sales, revenue or return on investment.',
    ],
  },
  {
    heading: 'Demonstration content',
    body: [
      'Visual mock-ups shown on this website — such as the phone and dashboard visuals — are clearly labelled "Demo" and are illustrative only. They do not represent real client data or results.',
    ],
  },
  {
    heading: 'General information only',
    body: [
      'Articles and insights on this website are general in nature and do not constitute professional, financial or legal advice for your specific situation.',
    ],
  },
];

function LegalPage({ eyebrow, title, highlight, intro, sections }: {
  eyebrow: string;
  title: string;
  highlight: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div>
      <PageHero eyebrow={eyebrow} title={title} highlight={highlight} description={intro} />
      <section className="pb-24">
        <div className="container-page max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 60}>
              <div className="card-surface p-8">
                <h2 className="text-xl font-bold">{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-3 text-sm leading-relaxed text-slate-400">{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
          <Reveal>
            <p className="text-xs text-slate-500">Last updated: January 2026</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy"
      highlight="policy."
      intro="What we collect, why we collect it, and the control you have over your information."
      sections={PRIVACY}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms &"
      highlight="conditions."
      intro="The ground rules for using this website and engaging our services."
      sections={TERMS}
    />
  );
}

export function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title=""
      highlight="Disclaimer."
      intro="Honest boundaries: what this website can and cannot promise."
      sections={DISCLAIMER}
    />
  );
}
