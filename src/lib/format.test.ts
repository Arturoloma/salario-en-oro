import { describe, expect, it } from 'vitest';

import { formatNumber } from './format';

describe('formatNumber', () => {
  it('should format numbers with Spanish locale by default', () => {
    expect(formatNumber(1234567.89)).toBe('1.234.567,89');
  });

  it('should format numbers with a custom locale', () => {
    expect(formatNumber(1234567.89, 'en-US')).toBe('1,234,567.89');
  });
});
