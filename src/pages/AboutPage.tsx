import { Compass, Handshake, MapPin } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';

const VALUES = [
  {
    icon: Compass,
    title: 'Strategy before activity',
    description:
      'We never start with posting. We start with positioning: who you serve, why they choose you, and what story earns their trust.',
  },
  {
    icon: Handshake,
    title: 'Partners, not vendors',
    description:
      'We act like your in-house growth team — transparent, reachable, and honest when something is not working.',
  },
  {
    icon: MapPin,
    title: 'Local first',
    description:
      'We started in Anantapur and we understand local businesses from the inside: the footfall, the festivals, the word of mouth.',
  },
];

export function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="The growth team for businesses that"
        highlight="keep their promises."
        description="Novaflo exists because good local businesses deserve better than cookie-cutter templates, inflated follower counts and agencies that vanish after onboarding."
      />
      <section className="pb-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="text-3xl font-bold">Our story</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-400">
                <p>
                  Novaflo started with a simple observation: the best businesses in town are often
                  invisible online, while louder competitors with weaker service capture the
                  attention — and the customers.
                </p>
                <p>
                  We set out to change that. Not with hacks or shortcuts, but with a repeatable
                  system: understand the business deeply, build a strategy around its real
                  strengths, produce content worth stopping for, and measure what matters.
                </p>
                <p>
                  Today we partner with restaurants, salons, clinics, retail stores and growing
                  brands — helping each one become the trusted name in their category.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card-surface p-8">
                <p className="eyebrow">Our promise</p>
                <p className="mt-4 font-display text-xl font-semibold leading-relaxed text-white">
                  "We will never promise followers, virality or magic numbers. We promise clarity,
                  consistency and content your customers will thank you for."
                </p>
                <p className="mt-5 text-sm text-slate-500">— The Novaflo team</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="card-surface h-full p-7">
                  <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400">
                    <v.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
