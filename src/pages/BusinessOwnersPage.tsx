import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, TrendingDown, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';

const PAINS = [
  {
    icon: Clock,
    title: 'No time to post',
    description:
      'You are running a business. Somewhere between operations, staff and customers, social media always ends up last on the list.',
  },
  {
    icon: TrendingDown,
    title: 'Posting into the void',
    description:
      'You post occasionally, engagement is flat, and it is impossible to tell whether any of it brings in business.',
  },
  {
    icon: Users,
    title: 'Agencies that overpromise',
    description:
      'You have been pitched guaranteed followers and viral reels. What you actually need is trust with the people in your city.',
  },
];

const OUTCOMES = [
  'A content strategy built around your real customers — not generic templates',
  'Professional posts, reels and captions delivered on a schedule you approve',
  'Local discovery work so nearby buyers actually find you first',
  'Plain-language monthly reports focused on enquiries and bookings, not vanity metrics',
  'A team that tells you honestly when something is not working',
];

const FIT_CHECK = [
  'You serve local customers or a growing regional market',
  'You want a partner, not a post factory',
  'You can approve content quickly when it is presented well',
  'You care about customers, not follower counts',
];

export function BusinessOwnersPage() {
  return (
    <div>
      <PageHero
        eyebrow="For business owners"
        title="You built a great business. We make sure"
        highlight="people know about it."
        description="This page is written for the owner doing everything — operations, sales, staff and somehow also the Instagram account. Here is what changes when growth is handled properly."
      />
      <section className="pb-24">
        <div className="container-page space-y-20">
          <div>
            <Reveal>
              <p className="eyebrow">Sound familiar?</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
                The three problems we hear most.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PAINS.map((p, i) => (
                <Reveal key={p.title} delay={i * 100}>
                  <div className="card-surface h-full p-7">
                    <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400">
                      <p.icon size={22} />
                    </div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="card-surface h-full p-8">
                <p className="eyebrow">What you get</p>
                <h3 className="mt-3 text-2xl font-bold">Growth, minus the chaos.</h3>
                <ul className="mt-6 space-y-3.5">
                  {OUTCOMES.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card-surface h-full p-8">
                <p className="eyebrow">Is this for you?</p>
                <h3 className="mt-3 text-2xl font-bold">We are a fit if…</h3>
                <ul className="mt-6 space-y-3.5">
                  {FIT_CHECK.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <MapPin size={17} className="mt-0.5 shrink-0 text-accent-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-4 text-xs leading-relaxed text-warning">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  We are not a fit if you expect guaranteed followers or overnight results. We build
                  trust steadily — that is the honest way it works.
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-accent-400/20 bg-gradient-to-br from-ink-800 to-ink-900 p-10 text-center sm:p-14">
              <div className="glow-orb -top-20 left-1/2 h-56 w-56 -translate-x-1/2 bg-accent-500/15" />
              <div className="relative">
                <h2 className="text-3xl font-bold sm:text-4xl">
                  One free call. Zero pressure.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-slate-400">
                  Thirty minutes on your business, and you keep the plan afterwards — whether or not
                  we work together.
                </p>
                <Link to="/growth-call" className="btn-primary mt-8">
                  Book your free growth call <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
