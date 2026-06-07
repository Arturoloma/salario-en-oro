import { describe, expect, it } from 'vitest';

import {
  calculateGoldCoins,
  calculateGoldGrams,
  calculateInflationAdjustedSalary,
  convertEspToEur,
  convertEurToEsp,
  goldGramsToCoins,
} from './calculate';
import { EUR_TO_ESP } from './constants';

describe('goldGramsToCoins', () => {
  it('converts fine gold grams to historical gold coins', () => {
    expect(goldGramsToCoins(5.81)).toBe(1);
    expect(goldGramsToCoins(11.62)).toBe(2);
  });
});

describe('calculateInflationAdjustedSalary', () => {
  it('calculates inflation-adjusted salary correctly', () => {
    const result = calculateInflationAdjustedSalary(35000, 100, 50);
    expect(result).toBe(17500);
  });

  it('handles same year (no adjustment)', () => {
    const result = calculateInflationAdjustedSalary(35000, 100, 100);
    expect(result).toBe(35000);
  });

  it('throws when CPI values are not positive and finite', () => {
    expect(() => calculateInflationAdjustedSalary(35000, 0, 100)).toThrow(
      'currentYearCpi must be a positive finite number',
    );
    expect(() =>
      calculateInflationAdjustedSalary(35000, 100, Infinity),
    ).toThrow('targetYearCpi must be a positive finite number');
  });
});

describe('calculateGoldGrams', () => {
  it('calculates gold grams from salary and price', () => {
    const result = calculateGoldGrams(1000, 50);
    expect(result).toBe(20);
  });

  it('handles zero salary', () => {
    const result = calculateGoldGrams(0, 50);
    expect(result).toBe(0);
  });

  it('throws when gold price is not positive and finite', () => {
    expect(() => calculateGoldGrams(1000, 0)).toThrow(
      'goldEurPerGram must be a positive finite number',
    );
    expect(() => calculateGoldGrams(1000, NaN)).toThrow(
      'goldEurPerGram must be a positive finite number',
    );
  });
});

describe('calculateGoldCoins', () => {
  it('calculates gold coins from salary and price', () => {
    const result = calculateGoldCoins(581, 100);
    expect(result).toBe(1);
  });
});

describe('convertEurToEsp', () => {
  it('converts EUR to ESP using fixed rate', () => {
    const result = convertEurToEsp(1);
    expect(result).toBe(EUR_TO_ESP);
  });
});

describe('convertEspToEur', () => {
  it('converts ESP to EUR using fixed rate', () => {
    const result = convertEspToEur(EUR_TO_ESP);
    expect(result).toBe(1);
  });
});
