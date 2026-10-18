import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MailCheck, CheckCircle2, Loader2, AlertCircle, Mail, Phone, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { captureAttribution } from '@/lib/attribution';
import { allowSubmission } from '@/lib/rateLimit';
import { notifyNewLead } from '@/lib/notifications';
import { contactSchema, zodErrors, type ContactInput } from '@/lib/validation';

interface FormState extends ContactInput {}

const EMPTY: FormState = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error));
      return;
    }
    setErrors({});

    setStatus('submitting');
    setServerError('');

    if (!allowSubmission('contact')) {
      setStatus('error');
      setServerError('Too many requests. Please wait a minute and try again.');
      return;
    }

    const attribution = captureAttribution();
    const data = parsed.data;

    const { error } = await supabase.from('leads').insert({
      type: 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: `Subject: ${data.subject || 'General enquiry'}\n\n${data.message}`,
      ...attribution,
    });

    if (error) {
      setStatus('error');
      setServerError('Something went wrong while sending your message. Please try again.');
      return;
    }

    notifyNewLead({
      type: 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: null,
      serviceInterest: data.subject || null,
      message: data.message,
      budget: null,
      timeline: null,
      serviceArea: null,
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    });

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="card-surface flex flex-col items-center p-10 text-center">
        <div className="rounded-full bg-success/10 p-4 text-success">
          <MailCheck size={36} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Message sent!</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Thanks for reaching out. We will get back to you within one business day.
        </p>
        <Link to="/" className="btn-secondary mt-8">Back to home</Link>
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
          <label htmlFor="ct-name" className="mb-1.5 block text-sm font-medium text-slate-300">Your name *</label>
          <input id="ct-name" className="input-field" value={form.name} onChange={set('name')} placeholder="Priya Sharma" />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="ct-email" className="mb-1.5 block text-sm font-medium text-slate-300">Email *</label>
          <input id="ct-email" type="email" className="input-field" value={form.email} onChange={set('email')} placeholder="you@business.com" />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-phone" className="mb-1.5 block text-sm font-medium text-slate-300">Phone (optional)</label>
          <input id="ct-phone" type="tel" className="input-field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label htmlFor="ct-subject" className="mb-1.5 block text-sm font-medium text-slate-300">Subject</label>
          <input id="ct-subject" className="input-field" value={form.subject} onChange={set('subject')} placeholder="Growth plan question" />
        </div>
      </div>

      <div>
        <label htmlFor="ct-message" className="mb-1.5 block text-sm font-medium text-slate-300">Message *</label>
        <textarea id="ct-message" rows={5} className="input-field resize-none" value={form.message} onChange={set('message')} placeholder="Tell us about your business and what you need…" />
        {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message}</p>}
      </div>

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
          <>Send message <ArrowRight size={16} /></>
        )}
      </button>
    </form>
  );
}

export function ContactPage() {
  return (
    <div className="pt-36 pb-24">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Let's talk about your growth.</h1>
          <p className="mt-5 leading-relaxed text-slate-400">
            Questions about services, pricing or process? Send us a message and we will reply within
            one business day.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="card-surface p-8 sm:p-10">
            <ContactForm />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card-surface flex items-center gap-3 p-4 text-sm text-slate-300">
              <Mail size={16} className="text-accent-400" /> hello@novaflo.agency
            </div>
            <div className="card-surface flex items-center gap-3 p-4 text-sm text-slate-300">
              <Phone size={16} className="text-accent-400" /> Available on request
            </div>
            <div className="card-surface flex items-center gap-3 p-4 text-sm text-slate-300">
              <MessageCircle size={16} className="text-accent-400" /> Anantapur, India
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
            <CheckCircle2 size={15} className="text-success" />
            Prefer to talk it through?{' '}
            <Link to="/growth-call" className="font-medium text-accent-400 hover:text-accent-300">
              Book a free growth call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
