import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { GrowthCallForm } from '@/components/forms/GrowthCallForm';

export function GrowthCallPage() {
  return (
    <div className="pt-36 pb-24">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Growth call</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Book your free <span className="text-accent-400">growth call</span>.
          </h1>
          <p className="mt-5 leading-relaxed text-slate-400">
            30 focused minutes on your business. You will leave with clarity on what is blocking
            your growth — whether or not we work together.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <Reveal>
            <div className="card-surface p-8 sm:p-10">
              <GrowthCallForm />
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Free, no strings', text: 'No sales script, no pressure to sign up.' },
              { title: 'Tailored to you', text: 'We prepare after you book — not a generic pitch.' },
              { title: 'Actionable output', text: 'A written summary of next steps, yours to keep.' },
            ].map((c) => (
              <div key={c.title} className="card-surface p-5">
                <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
