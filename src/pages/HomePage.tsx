import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Target,
  PenLine,
  CalendarDays,
  Video,
  Search,
  Megaphone,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { getServices, type ServiceRecord } from '@/lib/cms';
import { PROCESS, TIMELINE_MILESTONES } from '@/data/content';

const SERVICE_ICONS = {
  target: Target,
  pen: PenLine,
  calendar: CalendarDays,
  video: Video,
  search: Search,
  megaphone: Megaphone,
};

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: 'No fake promises',
    description: 'No guaranteed followers, no viral gimmicks. Just honest strategy and steady execution.',
  },
  {
    icon: Sparkles,
    title: 'Everything approved by you',
    description: 'Nothing goes live until you have reviewed it. Your brand voice stays yours.',
  },
  {
    icon: TrendingUp,
    title: 'Measured on leads, not likes',
    description: 'We report on what actually matters: enquiries, bookings and growth.',
  },
];

const HOME_FAQ_TEASERS = [
  {
    question: 'How soon will I see results?',
    answer:
      'Most businesses see meaningful engagement improvement within 60–90 days of a steady, strategic posting rhythm. We set honest expectations upfront.',
  },
  {
    question: 'Do I have to appear on camera?',
    answer:
      'No. Many high-performing formats are product and design-led. If you enjoy being on camera, we use it — otherwise we build content that does not need you.',
  },
];

export function HomePage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="glow-orb -top-40 left-1/4 h-[28rem] w-[28rem] bg-accent-500/[0.13]" />
        <div className="glow-orb top-40 right-0 h-80 w-80 bg-blue-500/[0.08]" />
        <div className="container-page relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <p className="eyebrow">Social media growth agency</p>
                <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
                  Make your business the name customers{' '}
                  <span className="text-accent-400">remember</span>.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                  Novaflo turns your social media into a steady stream of trust, attention and
                  enquiries — built for local and growing businesses, without the guesswork.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link to="/growth-call" className="btn-primary">
                    Book your free growth call <ArrowRight size={16} />
                  </Link>
                  <Link to="/services" className="btn-secondary">
                    See how we help
                  </Link>
                </div>
                <p className="mt-5 text-xs text-slate-500">
                  Free 30-minute call · Honest plan · No pressure
                </p>
              </Reveal>
            </div>

            <Reveal delay={150} className="hidden lg:block">
              <div className="relative">
                <div className="card-surface relative mx-auto w-64 rotate-3 overflow-hidden rounded-[2rem] border-white/10 p-4 shadow-2xl shadow-accent-500/10">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      Demo
                    </span>
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-36 rounded-xl bg-gradient-to-br from-accent-500/25 to-blue-500/15" />
                    <div className="h-3 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-7 flex-1 rounded-full bg-accent-500/30" />
                      <div className="h-7 w-7 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>
                <div className="card-surface absolute -bottom-6 -left-10 w-44 -rotate-6 p-4 shadow-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Demo dashboard
                  </p>
                  <div className="mt-3 flex items-end gap-1.5">
                    {[35, 55, 40, 70, 60, 85, 75].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-t bg-accent-400/70"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-400">Enquiries trending up</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              Everything your growth needs, handled.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = SERVICE_ICONS[service.icon];
              return (
                <Reveal key={service.slug} delay={i * 80}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="card-surface group block h-full p-6 transition-all duration-300 hover:border-accent-400/30 hover:bg-ink-800"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Learn more <ArrowRight size={14} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-white/[0.06] bg-ink-900/40 py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              From first call to steady growth in four steps.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 100}>
                <div className="card-surface h-full p-6">
                  <span className="font-display text-3xl font-bold text-accent-400/40">{step.step}</span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
              {TIMELINE_MILESTONES.map((m) => (
                <span
                  key={m.week}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300"
                >
                  <span className="text-accent-400">{m.week}</span> · {m.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow">Why Novaflo</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Built different, on purpose.
              </h2>
              <p className="mt-5 leading-relaxed text-slate-400">
                Most agencies sell you activity: posts, hashtags, follower counts. We build a growth
                system — strategy, content and measurement pointed at one thing: more customers for
                your business.
              </p>
              <Link to="/about" className="btn-secondary mt-8">
                More about us
              </Link>
            </Reveal>
            <div className="space-y-4">
              {DIFFERENTIATORS.map((d, i) => (
                <Reveal key={d.title} delay={i * 100}>
                  <div className="card-surface flex gap-4 p-6 transition-colors duration-300 hover:border-accent-400/30">
                    <div className="rounded-xl bg-accent-500/10 p-3 text-accent-400 h-fit">
                      <d.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{d.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-accent-400/20 bg-gradient-to-br from-ink-800 to-ink-900 p-10 text-center sm:p-16">
              <div className="glow-orb -top-24 left-1/2 h-64 w-64 -translate-x-1/2 bg-accent-500/15" />
              <div className="relative">
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Ready to become the trusted name in your city?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-slate-400">
                  Book a free 30-minute growth call. You will leave with a clear plan — whether or
                  not we work together.
                </p>
                <Link to="/growth-call" className="btn-primary mt-8">
                  Book your growth call <ArrowRight size={16} />
                </Link>
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> No commitment</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> Written plan included</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-success" /> Local first</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
