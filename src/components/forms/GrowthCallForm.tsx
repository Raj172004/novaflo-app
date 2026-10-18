import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { captureAttribution } from '@/lib/attribution';
import { allowSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';
import { growthCallSchema, zodErrors, type GrowthCallInput } from '@/lib/validation';
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from '@/data/content';

interface FormState extends GrowthCallInput {}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  businessType: '',
  serviceArea: '',
  serviceInterest: '',
  goals: '',
  budget: '',
  timeline: '',
  website: '',
};

export function GrowthCallForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = growthCallSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error));
      return;
    }
    setErrors({});

    setStatus('submitting');
    setServerError('');

    if (!allowSubmission('growth_call')) {
      setStatus('error');
      setServerError('Too many requests. Please wait a minute and try again.');
      return;
    }

    const attribution = captureAttribution();
    const data = parsed.data;

    const { error } = await supabase.from('leads').insert({
      type: 'growth_call',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      business_name: data.businessName || null,
      business_type: data.businessType || null,
      service_area: data.serviceArea || null,
      service_interest: data.serviceInterest || null,
      goals: data.goals || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      ...attribution,
    });

    if (error) {
      setStatus('error');
      setServerError('Something went wrong while sending your request. Please try again.');
      return;
    }

    notifyNewLead({
      type: 'growth_call',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.businessName || null,
      serviceInterest: data.serviceInterest || null,
      message: data.goals || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      serviceArea: data.serviceArea || null,
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    });

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="card-surface flex flex-col items-center p-10 text-center">
        <div className="rounded-full bg-success/10 p-4 text-success">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Request received!</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Thank you, {form.name.split(' ')[0]}. We have your growth call request and will reach out
          within one business day to confirm a time that suits you.
        </p>
        <Link to="/" className="btn-secondary mt-8">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gc-name" className="mb-1.5 block text-sm font-medium text-slate-300">Your name *</label>
          <input id="gc-name" className="input-field" value={form.name} onChange={set('name')} placeholder="Priya Sharma" />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="gc-email" className="mb-1.5 block text-sm font-medium text-slate-300">Email *</label>
          <input id="gc-email" type="email" className="input-field" value={form.email} onChange={set('email')} placeholder="you@business.com" />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gc-phone" className="mb-1.5 block text-sm font-medium text-slate-300">Phone / WhatsApp</label>
          <input id="gc-phone" type="tel" className="input-field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          {errors.phone && <p className="mt-1.5 text-xs text-danger">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="gc-bizname" className="mb-1.5 block text-sm font-medium text-slate-300">Business name</label>
          <input id="gc-bizname" className="input-field" value={form.businessName} onChange={set('businessName')} placeholder="Sharma Textiles" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gc-biztype" className="mb-1.5 block text-sm font-medium text-slate-300">Business type</label>
          <input id="gc-biztype" className="input-field" value={form.businessType} onChange={set('businessType')} placeholder="Restaurant, salon, clinic…" />
        </div>
        <div>
          <label htmlFor="gc-area" className="mb-1.5 block text-sm font-medium text-slate-300">Service area</label>
          <input id="gc-area" className="input-field" value={form.serviceArea} onChange={set('serviceArea')} placeholder="Anantapur" />
        </div>
      </div>

      <div>
        <label htmlFor="gc-interest" className="mb-1.5 block text-sm font-medium text-slate-300">Service you're interested in</label>
        <select id="gc-interest" className="input-field" value={form.serviceInterest} onChange={set('serviceInterest')}>
          <option value="">Select a service…</option>
          <option value="Social Media Strategy">Social Media Strategy</option>
          <option value="Content Creation">Content Creation</option>
          <option value="Content Calendar & Management">Content Calendar & Management</option>
          <option value="Reels & Video Editing">Reels & Video Editing</option>
          <option value="Local SEO & Discovery">Local SEO & Discovery</option>
          <option value="Paid Boosts & Promotions">Paid Boosts & Promotions</option>
          <option value="Full growth system">Full growth system (combination)</option>
        </select>
      </div>

      <div>
        <label htmlFor="gc-goals" className="mb-1.5 block text-sm font-medium text-slate-300">
          What do you want to achieve?
        </label>
        <textarea
          id="gc-goals"
          rows={4}
          className="input-field resize-none"
          value={form.goals}
          onChange={set('goals')}
          placeholder="More walk-ins, online orders, brand awareness…"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gc-budget" className="mb-1.5 block text-sm font-medium text-slate-300">Monthly budget</label>
          <select id="gc-budget" className="input-field" value={form.budget} onChange={set('budget')}>
            <option value="">Select…</option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gc-timeline" className="mb-1.5 block text-sm font-medium text-slate-300">Timeline</label>
          <select id="gc-timeline" className="input-field" value={form.timeline} onChange={set('timeline')}>
            <option value="">Select…</option>
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Honeypot — hidden from real users, bots fill it in */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60">
        {status === 'submitting' ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          <>Request my growth call <ArrowRight size={16} /></>
        )}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
        <CalendarCheck size={13} /> We reply within one business day.
      </p>
    </form>
  );
}
