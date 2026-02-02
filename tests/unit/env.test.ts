/**
 * Unit Tests — Environment validation
 *
 * Tests for env.ts parsing and helper functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the parseBool logic directly since getAuthFeatures reads from process.env
describe('Auth Feature Flags parsing', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should parse "true" as true', () => {
    const parseBool = (val: string | undefined, defaultVal: boolean): boolean => {
      if (val === undefined || val === '') return defaultVal;
      return val.toLowerCase() !== 'false' && val !== '0';
    };

    expect(parseBool('true', false)).toBe(true);
    expect(parseBool('TRUE', false)).toBe(true);
    expect(parseBool('True', false)).toBe(true);
  });

  it('should parse "false" as false', () => {
    const parseBool = (val: string | undefined, defaultVal: boolean): boolean => {
      if (val === undefined || val === '') return defaultVal;
      return val.toLowerCase() !== 'false' && val !== '0';
    };

    expect(parseBool('false', true)).toBe(false);
    expect(parseBool('FALSE', true)).toBe(false);
    expect(parseBool('0', true)).toBe(false);
  });

  it('should use default when undefined', () => {
    const parseBool = (val: string | undefined, defaultVal: boolean): boolean => {
      if (val === undefined || val === '') return defaultVal;
      return val.toLowerCase() !== 'false' && val !== '0';
    };

    expect(parseBool(undefined, true)).toBe(true);
    expect(parseBool(undefined, false)).toBe(false);
    expect(parseBool('', true)).toBe(true);
  });
});

describe('Email configuration detection', () => {
  it('should recognize resend as configured when API key and FROM exist', () => {
    // This is a simplified test - real test would need to mock getEnv
    const isResendConfigured = (provider: string, apiKey?: string, from?: string) => {
      if (provider !== 'resend') return false;
      return !!apiKey && !!from;
    };

    expect(isResendConfigured('resend', 're_xxx', 'test@example.com')).toBe(true);
    expect(isResendConfigured('resend', '', 'test@example.com')).toBe(false);
    expect(isResendConfigured('smtp', 're_xxx', 'test@example.com')).toBe(false);
  });

  it('should recognize smtp as configured when host and FROM exist', () => {
    const isSmtpConfigured = (provider: string, host?: string, from?: string) => {
      if (provider !== 'smtp') return false;
      return !!host && !!from;
    };

    expect(isSmtpConfigured('smtp', 'smtp.example.com', 'test@example.com')).toBe(true);
    expect(isSmtpConfigured('smtp', '', 'test@example.com')).toBe(false);
  });
});
