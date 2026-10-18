import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: string;
  type: 'growth_call' | 'contact';
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_type: string | null;
  service_area: string | null;
  goals: string | null;
  message: string | null;
  budget: string | null;
  timeline: string | null;
  preferred_contact: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = Lead['status'];

export const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};
