import { describe, it, expect } from 'vitest';
import { contactSchema, growthCallSchema } from './validation';

const VALID_CONTACT = {
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+91 98765 43210',
  subject: 'Growth plan question',
  message: 'We need help with our social media presence.',
  website: '',
};

const VALID_GROWTH_CALL = {
  name: 'Ravi Kumar',
  email: 'ravi@sharmatextiles.in',
  phone: '9876543210',
  businessName: 'Sharma Textiles',
  businessType: 'Retail',
  serviceArea: 'Anantapur',
  serviceInterest: 'Content Creation',
  goals: 'More online orders',
  budget: '₹10,000 – ₹25,000',
  timeline: '1-3 months',
  website: '',
};

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    const result = contactSchema.safeParse(VALID_CONTACT);
    expect(result.success).toBe(true);
  });

  it('rejects names shorter than 2 characters', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('name'))).toBe(true);
    }
  });

  it('rejects invalid email addresses', () => {
    for (const bad of ['plain', 'a@b', '@example.com', 'user@', '']) {
      const result = contactSchema.safeParse({ ...VALID_CONTACT, email: bad });
      expect(result.success).toBe(false);
    }
  });

  it('rejects messages shorter than 10 characters', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, message: 'short' });
    expect(result.success).toBe(false);
  });

  it('accepts an empty optional phone', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, phone: '' });
    expect(result.success).toBe(true);
  });

  it('rejects phones with fewer than 10 digits', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, phone: '12345' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('phone'))).toBe(true);
    }
  });

  it('rejects a filled honeypot field', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('rejects unexpected extra fields (strict mode)', () => {
    const result = contactSchema.safeParse({ ...VALID_CONTACT, extra: 'nope' });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from name and email', () => {
    const result = contactSchema.safeParse({
      ...VALID_CONTACT,
      name: '  Priya Sharma  ',
      email: '  priya@example.com ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Priya Sharma');
      expect(result.data.email).toBe('priya@example.com');
    }
  });
});

describe('growthCallSchema', () => {
  it('accepts a valid submission', () => {
    const result = growthCallSchema.safeParse(VALID_GROWTH_CALL);
    expect(result.success).toBe(true);
  });

  it('accepts a submission with only required fields', () => {
    const result = growthCallSchema.safeParse({
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      phone: '',
      businessName: '',
      businessType: '',
      serviceArea: '',
      serviceInterest: '',
      goals: '',
      budget: '',
      timeline: '',
      website: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    const result = growthCallSchema.safeParse({ ...VALID_GROWTH_CALL, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects names shorter than 2 characters', () => {
    const result = growthCallSchema.safeParse({ ...VALID_GROWTH_CALL, name: 'R' });
    expect(result.success).toBe(false);
  });

  it('rejects phones with fewer than 10 digits when provided', () => {
    const result = growthCallSchema.safeParse({ ...VALID_GROWTH_CALL, phone: '98765' });
    expect(result.success).toBe(false);
  });

  it('rejects a filled honeypot field', () => {
    const result = growthCallSchema.safeParse({ ...VALID_GROWTH_CALL, website: 'bot' });
    expect(result.success).toBe(false);
  });

  it('rejects unexpected extra fields (strict mode)', () => {
    const result = growthCallSchema.safeParse({ ...VALID_GROWTH_CALL, admin: true });
    expect(result.success).toBe(false);
  });
});
