import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, Loader2, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Incorrect email or password. Please try again.');
      return;
    }
    navigate('/admin', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={15} /> Back to website
        </Link>
        <div className="card-surface p-8">
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-accent-400" />
            <span className="font-display text-lg font-bold text-white">Novaflo Admin</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">Access the leads dashboard.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@novaflo.agency"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />} Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
