import { Link } from 'react-router-dom';
import { Waves, Mail, MapPin } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    heading: 'Services',
    links: [
      { to: '/services', label: 'All services' },
      { to: '/services/social-media-strategy', label: 'Strategy' },
      { to: '/services/content-creation', label: 'Content creation' },
      { to: '/services/reels-video-editing', label: 'Reels & video' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/how-it-works', label: 'How it works' },
      { to: '/business-owners', label: 'For business owners' },
      { to: '/insights', label: 'Insights' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy policy' },
      { to: '/terms-and-conditions', label: 'Terms & conditions' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-900/60">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Waves className="h-6 w-6 text-accent-400" />
              <span className="font-display text-lg font-bold text-white tracking-tight">Novaflo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Make your business the trusted name customers remember. Social media growth for local
              and growing businesses.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-accent-400" /> hello@novaflo.agency
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-accent-400" /> Anantapur, Andhra Pradesh, India
              </p>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-white">{col.heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-accent-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Novaflo. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs text-slate-500 transition-colors hover:text-slate-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
