import { describe, expect, it } from 'vitest';

import {
  calculateCpiAdjustedSalary,
  calculateGoldCoins,
  calculateGoldGrams,
  calculateInflationAdjustedSalary,
  calculateSalaryGoldComparison,
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

describe('calculateCpiAdjustedSalary', () => {
  it('adjusts a salary from one CPI year to another', () => {
    const result = calculateCpiAdjustedSalary(1000, 50, 125);

    expect(result).toBe(2500);
  });

  it('throws when CPI values are not positive and finite', () => {
    expect(() => calculateCpiAdjustedSalary(1000, 0, 125)).toThrow(
      'sourceYearCpi must be a positive finite number',
    );
    expect(() => calculateCpiAdjustedSalary(1000, 50, -1)).toThrow(
      'targetYearCpi must be a positive finite number',
    );
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

describe('calculateSalaryGoldComparison', () => {
  it('compares past and current salaries through CPI and gold', () => {
    const result = calculateSalaryGoldComparison({
      pastSalaryEur: 1000,
      currentSalaryEur: 3000,
      pastYearCpi: 50,
      currentYearCpi: 100,
      pastGoldEurPerGram: 10,
      currentGoldEurPerGram: 20,
    });

    expect(result).toEqual({
      pastGoldCoins: 100 / 5.81,
      inflationAdjustedSalaryEur: 2000,
      inflationAdjustedGoldCoinsAtCurrentPrice: 100 / 5.81,
      currentGoldCoins: 150 / 5.81,
    });
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
