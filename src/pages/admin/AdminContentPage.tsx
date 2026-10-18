import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Waves, LogOut, ArrowLeft, Loader2, AlertCircle, Plus, Pencil, Trash2, Eye, EyeOff, Save, X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getServices, getInsights, type ServiceRecord, type InsightRecord } from '@/lib/cms';

type Tab = 'services' | 'insights';

const ICON_OPTIONS = ['target', 'pen', 'calendar', 'video', 'search', 'megaphone'] as const;

interface ServiceForm {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string;
  icon: (typeof ICON_OPTIONS)[number];
  sort_order: number;
  published: boolean;
}

interface InsightForm {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  published: boolean;
}

const EMPTY_SERVICE: ServiceForm = {
  slug: '', name: '', tagline: '', description: '', deliverables: '', icon: 'target',
  sort_order: 0, published: true,
};

const EMPTY_INSIGHT: InsightForm = {
  slug: '', title: '', excerpt: '', content: '', category: 'General', read_time: '5 min', published: true,
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function AdminContentPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('services');
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [insights, setInsights] = useState<InsightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingService, setEditingService] = useState<ServiceForm | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingInsight, setEditingInsight] = useState<InsightForm | null>(null);
  const [editingInsightId, setEditingInsightId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate('/admin/login', { replace: true });
      return;
    }
    const [svc, ins] = await Promise.all([getServices(), getInsights()]);
    setServices(svc);
    setInsights(ins);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  }

  async function saveService() {
    if (!editingService) return;
    if (!editingService.name.trim() || !editingService.slug.trim()) {
      setError('Name and URL slug are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      slug: slugify(editingService.slug),
      name: editingService.name.trim(),
      tagline: editingService.tagline.trim(),
      description: editingService.description.trim(),
      deliverables: editingService.deliverables
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
      icon: editingService.icon,
      sort_order: Number(editingService.sort_order) || 0,
      published: editingService.published,
    };
    const { error: err } = editingServiceId
      ? await supabase.from('services').update(payload).eq('id', editingServiceId)
      : await supabase.from('services').insert(payload);
    setSaving(false);
    if (err) {
      setError('Could not save the service. The URL slug may already be in use.');
      return;
    }
    setEditingService(null);
    setEditingServiceId(null);
    flash('Service saved.');
    load();
  }

  async function saveInsight() {
    if (!editingInsight) return;
    if (!editingInsight.title.trim() || !editingInsight.slug.trim()) {
      setError('Title and URL slug are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      slug: slugify(editingInsight.slug),
      title: editingInsight.title.trim(),
      excerpt: editingInsight.excerpt.trim(),
      content: editingInsight.content.trim(),
      category: editingInsight.category.trim() || 'General',
      read_time: editingInsight.read_time.trim() || '5 min',
      published: editingInsight.published,
    };
    const { error: err } = editingInsightId
      ? await supabase.from('insights').update(payload).eq('id', editingInsightId)
      : await supabase.from('insights').insert(payload);
    setSaving(false);
    if (err) {
      setError('Could not save the article. The URL slug may already be in use.');
      return;
    }
    setEditingInsight(null);
    setEditingInsightId(null);
    flash('Article saved.');
    load();
  }

  async function togglePublished(record: ServiceRecord | InsightRecord, kind: Tab) {
    const table = kind === 'services' ? 'services' : 'insights';
    setError('');
    const { error: err } = await supabase
      .from(table)
      .update({ published: !record.published })
      .eq('id', record.id);
    if (err) {
      setError('Could not update visibility. Please try again.');
      return;
    }
    load();
  }

  async function remove(record: ServiceRecord | InsightRecord, kind: Tab) {
    const label = kind === 'services' ? (record as ServiceRecord).name : (record as InsightRecord).title;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    const table = kind === 'services' ? 'services' : 'insights';
    setError('');
    const { error: err } = await supabase.from(table).delete().eq('id', record.id);
    if (err) {
      setError('Could not delete. Please try again.');
      return;
    }
    flash('Deleted.');
    load();
  }

  function startEditService(s: ServiceRecord) {
    setEditingServiceId(s.id);
    setEditingService({
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      deliverables: s.deliverables.join('\n'),
      icon: s.icon,
      sort_order: s.sort_order,
      published: s.published,
    });
  }

  function startEditInsight(i: InsightRecord) {
    setEditingInsightId(i.id);
    setEditingInsight({
      slug: i.slug,
      title: i.title,
      excerpt: i.excerpt,
      content: i.content,
      category: i.category,
      read_time: i.read_time,
      published: i.published,
    });
  }

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
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <ArrowLeft size={15} /> Leads
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/admin/login', { replace: true });
              }}
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
            <h1 className="text-2xl font-bold">Content manager</h1>
            <p className="mt-1 text-sm text-slate-400">Edit what visitors see on the website.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTab('services');
                setEditingService({ ...EMPTY_SERVICE });
                setEditingServiceId(null);
              }}
              className="btn-primary text-sm"
            >
              <Plus size={15} /> New service
            </button>
            <button
              onClick={() => {
                setTab('insights');
                setEditingInsight({ ...EMPTY_INSIGHT });
                setEditingInsightId(null);
              }}
              className="btn-secondary text-sm"
            >
              <Plus size={15} /> New article
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab('services')}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              tab === 'services'
                ? 'border-accent-400/40 bg-accent-500/15 text-accent-300'
                : 'border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setTab('insights')}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              tab === 'insights'
                ? 'border-accent-400/40 bg-accent-500/15 text-accent-300'
                : 'border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Insights ({insights.length})
          </button>
        </div>

        {notice && (
          <div className="mt-5 rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">{notice}</div>
        )}
        {error && (
          <div className="mt-5 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-accent-400" />
          </div>
        ) : (
          <div className="mt-7 space-y-3">
            {tab === 'services' &&
              services.map((s) => (
                <div key={s.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">/{s.slug} · order {s.sort_order}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${s.published ? 'border-success/30 bg-success/10 text-success' : 'border-white/10 bg-white/[0.04] text-slate-400'}`}>
                      {s.published ? 'Live' : 'Hidden'}
                    </span>
                    <IconBtn label="Edit" onClick={() => startEditService(s)}><Pencil size={15} /></IconBtn>
                    <IconBtn label={s.published ? 'Hide' : 'Publish'} onClick={() => togglePublished(s, 'services')}>
                      {s.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => remove(s, 'services')}><Trash2 size={15} /></IconBtn>
                  </div>
                </div>
              ))}
            {tab === 'insights' &&
              insights.map((i) => (
                <div key={i.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{i.title}</p>
                    <p className="text-xs text-slate-500">/{i.slug} · {i.category} · {i.read_time}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${i.published ? 'border-success/30 bg-success/10 text-success' : 'border-white/10 bg-white/[0.04] text-slate-400'}`}>
                      {i.published ? 'Live' : 'Hidden'}
                    </span>
                    <IconBtn label="Edit" onClick={() => startEditInsight(i)}><Pencil size={15} /></IconBtn>
                    <IconBtn label={i.published ? 'Hide' : 'Publish'} onClick={() => togglePublished(i, 'insights')}>
                      {i.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => remove(i, 'insights')}><Trash2 size={15} /></IconBtn>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {editingService && (
        <Modal
          title={editingServiceId ? 'Edit service' : 'New service'}
          onClose={() => {
            setEditingService(null);
            setEditingServiceId(null);
          }}
        >
          <div className="space-y-4">
            <Field label="Name *">
              <input className="input-field" value={editingService.name}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value, slug: editingServiceId ? editingService.slug : slugify(e.target.value) })} />
            </Field>
            <Field label="URL slug *">
              <input className="input-field" value={editingService.slug}
                onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <input className="input-field" value={editingService.tagline}
                onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={4} className="input-field resize-none" value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} />
            </Field>
            <Field label="Deliverables (one per line)">
              <textarea rows={4} className="input-field resize-none" value={editingService.deliverables}
                onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Icon">
                <select className="input-field" value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value as ServiceForm['icon'] })}>
                  {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Sort order">
                <input type="number" className="input-field" value={editingService.sort_order}
                  onChange={(e) => setEditingService({ ...editingService, sort_order: Number(e.target.value) })} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={editingService.published}
                onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                className="h-4 w-4 accent-cyan-500" />
              Published (visible on the website)
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button className="btn-secondary text-sm" onClick={() => setEditingService(null)}>Cancel</button>
              <button className="btn-primary text-sm" disabled={saving} onClick={saveService}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editingInsight && (
        <Modal
          title={editingInsightId ? 'Edit article' : 'New article'}
          onClose={() => {
            setEditingInsight(null);
            setEditingInsightId(null);
          }}
        >
          <div className="space-y-4">
            <Field label="Title *">
              <input className="input-field" value={editingInsight.title}
                onChange={(e) => setEditingInsight({ ...editingInsight, title: e.target.value, slug: editingInsightId ? editingInsight.slug : slugify(e.target.value) })} />
            </Field>
            <Field label="URL slug *">
              <input className="input-field" value={editingInsight.slug}
                onChange={(e) => setEditingInsight({ ...editingInsight, slug: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input className="input-field" value={editingInsight.category}
                  onChange={(e) => setEditingInsight({ ...editingInsight, category: e.target.value })} />
              </Field>
              <Field label="Read time">
                <input className="input-field" value={editingInsight.read_time}
                  onChange={(e) => setEditingInsight({ ...editingInsight, read_time: e.target.value })} />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea rows={2} className="input-field resize-none" value={editingInsight.excerpt}
                onChange={(e) => setEditingInsight({ ...editingInsight, excerpt: e.target.value })} />
            </Field>
            <Field label="Article content (blank line between paragraphs)">
              <textarea rows={10} className="input-field resize-none" value={editingInsight.content}
                onChange={(e) => setEditingInsight({ ...editingInsight, content: e.target.value })} />
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={editingInsight.published}
                onChange={(e) => setEditingInsight({ ...editingInsight, published: e.target.checked })}
                className="h-4 w-4 accent-cyan-500" />
              Published (visible on the website)
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button className="btn-secondary text-sm" onClick={() => setEditingInsight(null)}>Cancel</button>
              <button className="btn-primary text-sm" disabled={saving} onClick={saveInsight}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, danger, children }: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-lg border border-white/10 p-2 text-slate-400 transition-colors ${
        danger ? 'hover:border-danger/40 hover:text-danger' : 'hover:border-accent-400/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto my-10 w-full max-w-lg rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:text-white" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}
