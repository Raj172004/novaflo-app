import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/industries', label: 'Industries' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
  { to: '/faqs', label: 'FAQs' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Waves className="h-6 w-6 text-accent-400" />
          <span className="font-display text-lg font-bold text-white tracking-tight">Novaflo</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname.startsWith(link.to)
                  ? 'text-accent-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link
            to="/growth-call"
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-200 hover:bg-accent-400 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
          >
            Book growth call <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-slate-300 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink-900/95 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-3 text-sm font-medium ${
                location.pathname.startsWith(link.to) ? 'text-accent-400' : 'text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/growth-call"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Book growth call <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </header>
  );
}
