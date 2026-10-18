import { CheckCircle2, PhoneCall, ClipboardList, Rocket } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { PROCESS, TIMELINE_MILESTONES } from '@/data/content';

const STEP_ICONS = [PhoneCall, ClipboardList, CheckCircle2, Rocket];

export function HowItWorksPage() {
  return (
    <div>
      <PageHero
        eyebrow="Process"
        title="A clear path from"
        highlight="call to growth."
        description="No mystery, no jargon. Here is exactly what working with Novaflo looks like, from your first call to your first monthly recap."
      />
      <section className="pb-24">
        <div className="container-page">
          <div className="relative space-y-6">
            <div className="absolute bottom-8 left-7 top-8 hidden w-px bg-gradient-to-b from-accent-400/50 via-white/10 to-transparent sm:block" />
            {PROCESS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <Reveal key={step.step} delay={i * 100}>
                  <div className="card-surface relative flex flex-col gap-5 p-7 sm:flex-row sm:items-start sm:gap-7">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-400">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-accent-400">
                        Step {step.step}
                      </span>
                      <h2 className="mt-1.5 text-xl font-bold">{step.title}</h2>
                      <p className="mt-2 leading-relaxed text-slate-400">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-14">
              <h3 className="text-lg font-semibold text-white">Your first month at a glance</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {TIMELINE_MILESTONES.map((m) => (
                  <div key={m.week} className="card-surface p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">{m.week}</p>
                    <p className="mt-2 text-sm font-medium text-white">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
