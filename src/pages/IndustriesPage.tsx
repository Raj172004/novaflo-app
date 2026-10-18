import { Store, Scissors, HeartPulse, ShoppingBag, Building2, Dumbbell } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { INDUSTRIES } from '@/data/content';

const INDUSTRY_ICONS = [Store, Scissors, HeartPulse, ShoppingBag, Building2, Dumbbell];

export function IndustriesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Industries"
        title="Built for businesses"
        highlight="like yours."
        description="We specialize in local, customer-facing businesses — the ones where trust and visibility directly translate into footfall and bookings."
      />
      <section className="pb-24">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, i) => {
            const Icon = INDUSTRY_ICONS[i % INDUSTRY_ICONS.length];
            return (
              <Reveal key={industry.name} delay={i * 80}>
                <div className="card-surface h-full p-6 transition-colors duration-300 hover:border-accent-400/30">
                  <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-semibold">{industry.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{industry.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
