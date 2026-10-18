import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, X } from 'lucide-react';

export function StickyCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  const visible = show && !dismissed;
  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="card-surface flex items-center gap-2 py-2 pl-4 pr-2 shadow-2xl shadow-black/40">
        <Link
          to="/growth-call"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-400 hover:text-accent-300"
        >
          <PhoneCall size={16} /> Free growth call
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full p-1.5 text-slate-500 hover:text-white"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
