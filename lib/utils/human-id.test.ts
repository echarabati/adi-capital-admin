import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateHumanId, HUMAN_ID_PREFIXES } from './human-id';

describe('generateHumanId', () => {
  // Mock the date to ensure consistent year in tests
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-30'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('with year (default)', () => {
    it('generates ID with correct format', () => {
      expect(generateHumanId(42, { prefix: 'ORD' })).toBe('ORD-2026-0042');
    });

    it('pads sequence to 4 digits by default', () => {
      expect(generateHumanId(1, { prefix: 'ORD' })).toBe('ORD-2026-0001');
      expect(generateHumanId(12, { prefix: 'ORD' })).toBe('ORD-2026-0012');
      expect(generateHumanId(123, { prefix: 'ORD' })).toBe('ORD-2026-0123');
      expect(generateHumanId(1234, { prefix: 'ORD' })).toBe('ORD-2026-1234');
    });

    it('does not truncate sequences longer than padLength', () => {
      expect(generateHumanId(12345, { prefix: 'ORD' })).toBe('ORD-2026-12345');
    });
  });

  describe('without year', () => {
    it('generates ID without year component', () => {
      expect(generateHumanId(1, { prefix: 'USR', includeYear: false })).toBe('USR-0001');
    });

    it('works with different prefixes', () => {
      expect(generateHumanId(42, { prefix: 'TKT', includeYear: false })).toBe('TKT-0042');
    });
  });

  describe('custom padding', () => {
    it('respects custom padLength', () => {
      expect(generateHumanId(1, { prefix: 'T', padLength: 6 })).toBe('T-2026-000001');
    });

    it('works with padLength of 2', () => {
      expect(generateHumanId(5, { prefix: 'A', padLength: 2 })).toBe('A-2026-05');
    });
  });

  describe('validation', () => {
    it('throws on zero sequence', () => {
      expect(() => generateHumanId(0, { prefix: 'ORD' })).toThrow(
        'Sequence must be a positive integer'
      );
    });

    it('throws on negative sequence', () => {
      expect(() => generateHumanId(-1, { prefix: 'ORD' })).toThrow(
        'Sequence must be a positive integer'
      );
    });

    it('throws on non-integer sequence', () => {
      expect(() => generateHumanId(1.5, { prefix: 'ORD' })).toThrow(
        'Sequence must be a positive integer'
      );
    });

    it('throws on empty prefix', () => {
      expect(() => generateHumanId(1, { prefix: '' })).toThrow('Prefix is required');
    });
  });

  describe('HUMAN_ID_PREFIXES', () => {
    it('exports common prefixes', () => {
      expect(HUMAN_ID_PREFIXES.USER).toBe('USR');
      expect(HUMAN_ID_PREFIXES.ORDER).toBe('ORD');
      expect(HUMAN_ID_PREFIXES.INVOICE).toBe('INV');
      expect(HUMAN_ID_PREFIXES.TICKET).toBe('TKT');
    });

    it('works with generateHumanId', () => {
      expect(generateHumanId(1, { prefix: HUMAN_ID_PREFIXES.ORDER })).toBe('ORD-2026-0001');
    });
  });
});
