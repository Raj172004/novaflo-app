import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
}

export function PageHero({ eyebrow, title, highlight, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="glow-orb -top-32 left-1/4 h-96 w-96 bg-accent-500/10" />
      <div className="container-page relative">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold">
            {title}{' '}
            {highlight && <span className="text-accent-400">{highlight}</span>}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">{description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/growth-call" className="btn-primary">
              Book a growth call <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-secondary">
              Explore services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
