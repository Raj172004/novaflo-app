import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Target,
  PenLine,
  CalendarDays,
  Video,
  Search,
  Megaphone,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { getServices, getServiceBySlug, type ServiceRecord } from '@/lib/cms';

const SERVICE_ICONS = {
  target: Target,
  pen: PenLine,
  calendar: CalendarDays,
  video: Video,
  search: Search,
  megaphone: Megaphone,
};

function ServiceCard({ service, delay }: { service: ServiceRecord; delay: number }) {
  const Icon = SERVICE_ICONS[service.icon] ?? Target;
  return (
    <Reveal delay={delay}>
      <Link
        to={`/services/${service.slug}`}
        className="card-surface group block h-full p-6 transition-all duration-300 hover:border-accent-400/30 hover:bg-ink-800"
      >
        <div className="mb-4 inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400 transition-transform duration-300 group-hover:scale-110">
          <Icon size={22} />
        </div>
        <h2 className="text-lg font-semibold">{service.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View details <ArrowRight size={14} />
        </span>
      </Link>
    </Reveal>
  );
}

export function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[] | null>(null);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Growth services that"
        highlight="actually move the needle."
        description="Every service is built for one outcome: more trust, more attention and more customers for your business. Pick what you need or combine them into a full growth system."
      />
      <section className="pb-24">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services === null ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 size={28} className="animate-spin text-accent-400" />
            </div>
          ) : (
            services.map((service, i) => <ServiceCard key={service.slug} service={service} delay={i * 80} />)
          )}
        </div>
      </section>
    </div>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceRecord | null | 'loading'>('loading');

  useEffect(() => {
    let active = true;
    getServiceBySlug(slug ?? '').then((s) => {
      if (active) setService(s);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (service === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-32">
        <Loader2 size={28} className="animate-spin text-accent-400" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32 text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <p className="mt-3 text-slate-400">The service you are looking for does not exist.</p>
        <Link to="/services" className="btn-secondary mt-8">
          <ArrowLeft size={16} /> Back to services
        </Link>
      </div>
    );
  }

  const Icon = SERVICE_ICONS[service.icon] ?? Target;

  return (
    <div>
      <PageHero eyebrow="Service" title={service.name} description={service.tagline} />
      <section className="pb-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="card-surface p-8">
              <div className="inline-flex rounded-xl bg-accent-500/10 p-3 text-accent-400">
                <Icon size={26} />
              </div>
              <h2 className="mt-5 text-2xl font-bold">What this includes</h2>
              <p className="mt-4 leading-relaxed text-slate-400">{service.description}</p>
              <ul className="mt-6 space-y-3">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent-400" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card-surface flex h-full flex-col justify-between p-8">
              <div>
                <h3 className="text-xl font-bold">Want this for your business?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Book a free growth call and we will map exactly how this fits your business — with
                  honest timelines and clear pricing.
                </p>
              </div>
              <Link to="/growth-call" className="btn-primary mt-8">
                Book a growth call <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
