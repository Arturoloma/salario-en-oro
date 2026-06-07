import { describe, expect, it } from 'vitest';

import { buildCalculationData } from './build-calculation-data.js';
import type { AnnualDataset } from './types.js';

describe('buildCalculationData', () => {
  const createDataset = (
    id: string,
    data: Array<{ year: number; value: number }>,
  ): AnnualDataset => ({
    id,
    source: 'Test Source',
    sourceUrl: 'https://example.com',
    retrievedAt: '2026-06-06',
    units: 'test',
    frequency: 'annual',
    data,
  });

  it('should build calculation data from all datasets', () => {
    const cpiData = createDataset('cpi', [
      { year: 2020, value: 100 },
      { year: 2021, value: 105 },
    ]);

    const goldData = createDataset('gold', [
      { year: 2020, value: 1800 },
      { year: 2021, value: 1900 },
    ]);

    const eurUsdData = createDataset('eur-usd', [
      { year: 2020, value: 1.2 },
      { year: 2021, value: 1.25 },
    ]);

    const espUsdData = createDataset('esp-usd', []);

    const result = buildCalculationData(
      cpiData,
      goldData,
      eurUsdData,
      espUsdData,
      '2026-06-06',
    );

    expect(result.retrievedAt).toBe('2026-06-06');
    expect(result.startYear).toBe(2020);
    expect(result.latestCompleteYear).toBe(2021);
    expect(result.data).toHaveLength(2);

    expect(result.data[0].year).toBe(2020);
    expect(result.data[0].cpiIndex).toBe(100);
    expect(result.data[0].goldUsdPerTroyOunce).toBe(1800);
    expect(result.data[0].eurUsdRate).toBe(1.2);
    expect(result.data[0].espUsdRate).toBeNull();
    expect(result.data[0].goldEurPerGram).toBeCloseTo(48.23, 1);

    expect(result.data[1].year).toBe(2021);
    expect(result.data[1].cpiIndex).toBe(105);
    expect(result.data[1].goldUsdPerTroyOunce).toBe(1900);
    expect(result.data[1].eurUsdRate).toBe(1.25);
    expect(result.data[1].espUsdRate).toBeNull();
  });

  it('should use ESP/USD rate when EUR/USD is not available', () => {
    const cpiData = createDataset('cpi', [{ year: 1975, value: 12.34 }]);
    const goldData = createDataset('gold', [{ year: 1975, value: 161.03 }]);
    const eurUsdData = createDataset('eur-usd', []);
    const espUsdData = createDataset('esp-usd', [{ year: 1975, value: 56.95 }]);

    const result = buildCalculationData(
      cpiData,
      goldData,
      eurUsdData,
      espUsdData,
      '2026-06-06',
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[0].eurUsdRate).toBeNull();
    expect(result.data[0].espUsdRate).toBe(56.95);
    expect(result.data[0].goldEurPerGram).toBeGreaterThan(0);
  });

  it('should skip years where CPI or gold data is missing', () => {
    const cpiData = createDataset('cpi', [
      { year: 2020, value: 100 },
      { year: 2022, value: 110 },
    ]);

    const goldData = createDataset('gold', [
      { year: 2020, value: 1800 },
      { year: 2021, value: 1850 },
    ]);

    const eurUsdData = createDataset('eur-usd', [
      { year: 2020, value: 1.2 },
      { year: 2021, value: 1.25 },
    ]);

    const espUsdData = createDataset('esp-usd', []);

    const result = buildCalculationData(
      cpiData,
      goldData,
      eurUsdData,
      espUsdData,
      '2026-06-06',
    );

    expect(result.data).toHaveLength(1);
    expect(result.data[0].year).toBe(2020);
  });

  it('should throw error when no exchange rate is available', () => {
    const cpiData = createDataset('cpi', [{ year: 2020, value: 100 }]);
    const goldData = createDataset('gold', [{ year: 2020, value: 1800 }]);
    const eurUsdData = createDataset('eur-usd', []);
    const espUsdData = createDataset('esp-usd', []);

    expect(() =>
      buildCalculationData(
        cpiData,
        goldData,
        eurUsdData,
        espUsdData,
        '2026-06-06',
      ),
    ).toThrow('No calculation data could be generated');
  });

  it('should throw error when no calculation data can be generated', () => {
    const cpiData = createDataset('cpi', []);
    const goldData = createDataset('gold', []);
    const eurUsdData = createDataset('eur-usd', []);
    const espUsdData = createDataset('esp-usd', []);

    expect(() =>
      buildCalculationData(
        cpiData,
        goldData,
        eurUsdData,
        espUsdData,
        '2026-06-06',
      ),
    ).toThrow('No years found in datasets');
  });

  it('should sort data by year', () => {
    const cpiData = createDataset('cpi', [
      { year: 2022, value: 110 },
      { year: 2020, value: 100 },
    ]);

    const goldData = createDataset('gold', [
      { year: 2022, value: 1900 },
      { year: 2020, value: 1800 },
    ]);

    const eurUsdData = createDataset('eur-usd', [
      { year: 2022, value: 1.3 },
      { year: 2020, value: 1.2 },
    ]);

    const espUsdData = createDataset('esp-usd', []);

    const result = buildCalculationData(
      cpiData,
      goldData,
      eurUsdData,
      espUsdData,
      '2026-06-06',
    );

    expect(result.data[0].year).toBe(2020);
    expect(result.data[1].year).toBe(2022);
  });
});
