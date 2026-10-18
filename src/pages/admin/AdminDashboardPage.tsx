import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, LogOut, RefreshCw, Inbox, Loader2, X, Phone, Mail, MapPin, Building2, Target, Trash2, Search, LayoutGrid } from 'lucide-react';
import { supabase, STATUS_ORDER, STATUS_LABELS, type Lead, type LeadStatus } from '@/lib/supabase';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-accent-500/15 text-accent-300 border-accent-400/30',
  contacted: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  qualified: 'bg-warning/15 text-warning border-warning/30',
  proposal: 'bg-white/10 text-slate-200 border-white/20',
  won: 'bg-success/15 text-success border-success/30',
  lost: 'bg-danger/10 text-danger border-danger/30',
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Could not load leads. Please try again.');
      setLeads([]);
    } else {
      setLeads((data as Lead[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/admin/login', { replace: true });
        return;
      }
      loadLeads();
    });
  }, [navigate, loadLeads]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  async function updateStatus(lead: Lead, status: LeadStatus) {
    setUpdatingId(lead.id);
    const { error: err } = await supabase.from('leads').update({ status }).eq('id', lead.id);
    setUpdatingId(null);
    if (err) {
      setError('Could not update the lead. Please try again.');
      return;
    }
    const updated = { ...lead, status };
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
    setSelected((prev) => (prev && prev.id === lead.id ? updated : prev));
  }

  async function deleteLead(lead: Lead) {
    if (!window.confirm(`Delete the lead from "${lead.name}"? This cannot be undone.`)) return;
    setUpdatingId(lead.id);
    const { error: err } = await supabase.from('leads').delete().eq('id', lead.id);
    setUpdatingId(null);
    if (err) {
      setError('Could not delete the lead. Please try again.');
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setSelected(null);
  }

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: leads.length };
    for (const s of STATUS_ORDER) map[s] = 0;
    for (const l of leads) map[l.status] = (map[l.status] ?? 0) + 1;
    return map;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.business_name ?? '').toLowerCase().includes(q)
      );
    });
  }, [leads, statusFilter, search]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-accent-400" />
            <span className="font-display text-lg font-bold text-white">Novaflo Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/content"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <LayoutGrid size={15} /> Content
            </Link>
            <button
              onClick={loadLeads}
              className="rounded-full p-2 text-slate-400 transition-colors hover:text-white"
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-danger/40 hover:text-danger"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads pipeline</h1>
            <p className="mt-1 text-sm text-slate-400">
              {counts.all} total · {counts.new ?? 0} new
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, business…"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={counts.all}
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          {STATUS_ORDER.map((s) => (
            <FilterChip
              key={s}
              label={STATUS_LABELS[s]}
              count={counts[s] ?? 0}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            />
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-accent-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-surface mt-8 flex flex-col items-center p-14 text-center">
            <Inbox size={32} className="text-slate-600" />
            <h2 className="mt-4 text-lg font-semibold">
              {leads.length === 0 ? 'No leads yet' : 'No leads match this view'}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              {leads.length === 0
                ? 'New growth call requests and contact messages will appear here.'
                : 'Try a different filter or search term.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.07]">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-900/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Name</th>
                  <th className="hidden px-5 py-3.5 font-medium md:table-cell">Business</th>
                  <th className="hidden px-5 py-3.5 font-medium lg:table-cell">Type</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="hidden px-5 py-3.5 font-medium sm:table-cell">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="cursor-pointer bg-ink-850/60 transition-colors hover:bg-ink-800"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </td>
                    <td className="hidden px-5 py-4 text-slate-300 md:table-cell">
                      {lead.business_name ?? <span className="text-slate-600">—</span>}
                    </td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-slate-300">
                        {lead.type === 'growth_call' ? 'Growth call' : 'Contact'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-xs text-slate-500 sm:table-cell">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatus={updateStatus}
          onDelete={deleteLead}
          busy={updatingId === selected.id}
        />
      )}
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? 'border-accent-400/40 bg-accent-500/15 text-accent-300'
          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
      }`}
    >
      {label} <span className="text-slate-500">{count}</span>
    </button>
  );
}

function LeadDrawer({ lead, onClose, onStatus, onDelete, busy }: {
  lead: Lead;
  onClose: () => void;
  onStatus: (lead: Lead, status: LeadStatus) => void;
  onDelete: (lead: Lead) => void;
  busy: boolean;
}) {
  const details: { icon: typeof Phone; label: string; value: string | null }[] = [
    { icon: Phone, label: 'Phone', value: lead.phone },
    { icon: Mail, label: 'Email', value: lead.email },
    { icon: Building2, label: 'Business', value: lead.business_name },
    { icon: Target, label: 'Business type', value: lead.business_type },
    { icon: MapPin, label: 'Service area', value: lead.service_area },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">Lead details</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div>
            <p className="text-xl font-bold text-white">{lead.name}</p>
            <p className="mt-1 text-sm text-slate-400">
              {lead.type === 'growth_call' ? 'Growth call request' : 'Contact message'} ·{' '}
              {new Date(lead.created_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Move to</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  disabled={busy || s === lead.status}
                  onClick={() => onStatus(lead, s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-100 ${
                    s === lead.status
                      ? STATUS_STYLES[s]
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-accent-400/40 hover:text-white'
                  }`}
                >
                  {busy && s !== lead.status ? '…' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {details
              .filter((d) => d.value)
              .map((d) => (
                <div key={d.label} className="flex items-center gap-3 text-sm">
                  <d.icon size={15} className="shrink-0 text-accent-400" />
                  <span className="text-slate-500">{d.label}:</span>
                  <span className="text-slate-200">{d.value}</span>
                </div>
              ))}
          </div>

          {lead.goals && (
            <div className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Goals</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{lead.goals}</p>
            </div>
          )}

          {lead.message && (
            <div className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">{lead.message}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {lead.budget && (
              <div className="card-surface p-4">
                <p className="text-xs text-slate-500">Budget</p>
                <p className="mt-1 text-sm text-slate-200">{lead.budget}</p>
              </div>
            )}
            {lead.timeline && (
              <div className="card-surface p-4">
                <p className="text-xs text-slate-500">Timeline</p>
                <p className="mt-1 text-sm text-slate-200">{lead.timeline}</p>
              </div>
            )}
          </div>

          {(lead.utm_source || lead.referrer) && (
            <div className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attribution</p>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                {lead.utm_source && <p>Source: {lead.utm_source}{lead.utm_medium ? ` / ${lead.utm_medium}` : ''}</p>}
                {lead.utm_campaign && <p>Campaign: {lead.utm_campaign}</p>}
                {lead.referrer && <p>Referrer: {lead.referrer}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={() => onDelete(lead)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={15} /> Delete lead
          </button>
        </div>
      </aside>
    </div>
  );
}
