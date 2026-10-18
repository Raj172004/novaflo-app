import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Session guard for all /admin routes. Waits for the Supabase session to be
 * resolved, then either renders the page or redirects to the sign-in screen.
 * A redirect target is remembered so signing back in returns the user to
 * where they were headed.
 */
export function RequireAdminSession({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setChecking(false);
      } else {
        navigate('/admin/login', {
          replace: true,
          state: { from: location.pathname },
        });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate, location.pathname]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400"
          role="status"
          aria-label="Checking session"
        />
      </div>
    );
  }

  return <>{children}</>;
}
