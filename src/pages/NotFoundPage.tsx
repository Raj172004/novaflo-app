import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-7xl font-bold text-accent-400/30">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page drifted away.</h1>
      <p className="mt-3 max-w-sm text-sm text-slate-400">
        The page you are looking for does not exist or has moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary"><Home size={16} /> Back to home</Link>
        <Link to="/services" className="btn-secondary"><Compass size={16} /> Explore services</Link>
      </div>
    </div>
  );
}
