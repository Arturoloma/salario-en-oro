import { describe, expect, it } from 'vitest';

import {
  normalizeEspUsdData,
  normalizeEurUsdData,
} from './normalize-exchange-rates.js';

describe('normalizeEurUsdData', () => {
  it('should parse valid EUR/USD data from CSV', () => {
    const csv = `Date,USD,JPY
2020-01-02,1.1234,123.45
2020-01-03,1.1256,123.67
2020-02-01,1.1278,124.01
2021-01-02,1.2345,130.12
2021-02-01,1.2367,130.45`;

    const result = normalizeEurUsdData(csv, '2026-06-06');

    expect(result.id).toBe('eur-usd-annual');
    expect(result.source).toBe('European Central Bank');
    expect(result.retrievedAt).toBe('2026-06-06');
    expect(result.units).toBe('USD per EUR');
    expect(result.frequency).toBe('annual');
    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(2020);
    expect(result.data[0].value).toBeCloseTo(1.1256, 4);
    expect(result.data[1].year).toBe(2021);
    expect(result.data[1].value).toBeCloseTo(1.2356, 4);
  });

  it('should calculate yearly averages', () => {
    const csv = `Date,USD
2020-01-01,1.0
2020-06-01,2.0
2020-12-01,3.0`;

    const result = normalizeEurUsdData(csv, '2026-06-06');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].year).toBe(2020);
    expect(result.data[0].value).toBe(2.0);
  });

  it('should exclude the retrieved current year because it is incomplete', () => {
    const csv = `Date,USD
2025-01-01,1.0
2026-01-01,2.0`;

    const result = normalizeEurUsdData(csv, '2026-06-06');

    expect(result.data).toEqual([{ year: 2025, value: 1.0 }]);
  });

  it('should skip rows with missing USD values', () => {
    const csv = `Date,USD
2020-01-01,1.1234
2020-01-02,
2020-01-03,1.1256`;

    const result = normalizeEurUsdData(csv, '2026-06-06');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].value).toBeCloseTo(1.1245, 4);
  });

  it('should skip rows with invalid USD values', () => {
    const csv = `Date,USD
2020-01-01,1.1234
2020-01-02,invalid
2020-01-03,-1.5
2020-01-04,0
2020-01-05,1.1256`;

    const result = normalizeEurUsdData(csv, '2026-06-06');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].value).toBeCloseTo(1.1245, 4);
  });

  it('should throw error when CSV is empty', () => {
    expect(() => normalizeEurUsdData('', '2026-06-06')).toThrow(
      'ECB CSV file is empty or has no data',
    );
  });

  it('should throw error when required columns are missing', () => {
    const csv = `Date,JPY
2020-01-01,123.45`;

    expect(() => normalizeEurUsdData(csv, '2026-06-06')).toThrow(
      'Required columns not found in ECB CSV',
    );
  });

  it('should throw error when no valid data is found', () => {
    const csv = `Date,USD
2020-01-01,invalid`;

    expect(() => normalizeEurUsdData(csv, '2026-06-06')).toThrow(
      'No valid EUR/USD data found in CSV',
    );
  });
});

describe('normalizeEspUsdData', () => {
  it('should parse valid ESP/USD data', () => {
    const rates = [
      { year: 1975, value: 56.95 },
      { year: 1976, value: 62.45 },
      { year: 1977, value: 70.55 },
    ];

    const result = normalizeEspUsdData(rates, '2026-06-06');

    expect(result.id).toBe('esp-usd-annual');
    expect(result.source).toBe('Banco de España');
    expect(result.retrievedAt).toBe('2026-06-06');
    expect(result.units).toBe('ESP per USD');
    expect(result.frequency).toBe('annual');
    expect(result.data).toHaveLength(3);
    expect(result.data[0]).toEqual({ year: 1975, value: 56.95 });
    expect(result.data[1]).toEqual({ year: 1976, value: 62.45 });
    expect(result.data[2]).toEqual({ year: 1977, value: 70.55 });
  });

  it('should sort data by year', () => {
    const rates = [
      { year: 1977, value: 70.55 },
      { year: 1975, value: 56.95 },
      { year: 1976, value: 62.45 },
    ];

    const result = normalizeEspUsdData(rates, '2026-06-06');

    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1976);
    expect(result.data[2].year).toBe(1977);
  });

  it('should skip items with invalid values', () => {
    const rates = [
      { year: 1975, value: 56.95 },
      { year: 1976, value: -10 },
      { year: 1977, value: 0 },
      { year: 1978, value: 70.55 },
    ];

    const result = normalizeEspUsdData(rates, '2026-06-06');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1978);
  });

  it('should throw error on duplicate years', () => {
    const rates = [
      { year: 1975, value: 56.95 },
      { year: 1975, value: 62.45 },
    ];

    expect(() => normalizeEspUsdData(rates, '2026-06-06')).toThrow(
      'Duplicate year found: 1975',
    );
  });

  it('should throw error when no valid data is found', () => {
    const rates: Array<{ year: number; value: number }> = [];

    expect(() => normalizeEspUsdData(rates, '2026-06-06')).toThrow(
      'No valid ESP/USD data found',
    );
  });
});
