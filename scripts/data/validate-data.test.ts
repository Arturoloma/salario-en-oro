import { describe, expect, it } from 'vitest';

import type { AnnualDataset, CalculationData, Metadata } from './types.js';
import {
  validateAllData,
  validateAnnualDataset,
  validateCalculationData,
  validateConstants,
  validateMetadata,
} from './validate-data.js';

describe('validateAnnualDataset', () => {
  const validDataset: AnnualDataset = {
    id: 'test',
    source: 'Test Source',
    sourceUrl: 'https://example.com',
    retrievedAt: '2026-06-06',
    units: 'test',
    frequency: 'annual',
    data: [
      { year: 2020, value: 100 },
      { year: 2021, value: 105 },
    ],
  };

  it('should return no errors for valid dataset', () => {
    const errors = validateAnnualDataset(validDataset);
    expect(errors).toHaveLength(0);
  });

  it('should return error for missing id', () => {
    const dataset = { ...validDataset, id: '' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'id',
      message: 'Missing dataset id',
    });
  });

  it('should return error for missing source', () => {
    const dataset = { ...validDataset, source: '' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'source',
      message: 'Missing source',
    });
  });

  it('should return error for missing sourceUrl', () => {
    const dataset = { ...validDataset, sourceUrl: '' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'sourceUrl',
      message: 'Missing sourceUrl',
    });
  });

  it('should return error for missing retrievedAt', () => {
    const dataset = { ...validDataset, retrievedAt: '' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'retrievedAt',
      message: 'Missing retrievedAt',
    });
  });

  it('should return error for invalid retrievedAt', () => {
    const dataset = { ...validDataset, retrievedAt: 'invalid-date' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'retrievedAt',
      message: 'Invalid retrievedAt date',
    });
  });

  it('should return error for missing units', () => {
    const dataset = { ...validDataset, units: '' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'units',
      message: 'Missing units',
    });
  });

  it('should return error for invalid frequency', () => {
    const dataset = { ...validDataset, frequency: 'monthly' as 'annual' };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'frequency',
      message: 'Frequency must be annual',
    });
  });

  it('should return error for empty data', () => {
    const dataset = { ...validDataset, data: [] };
    const errors = validateAnnualDataset(dataset);
    expect(errors).toContainEqual({
      field: 'data',
      message: 'No data points',
    });
  });

  it('should return error for invalid year', () => {
    const dataset = {
      ...validDataset,
      data: [{ year: NaN, value: 100 }],
    };
    const errors = validateAnnualDataset(dataset);
    expect(errors.some((e) => e.field.includes('year'))).toBe(true);
  });

  it('should return error for invalid value', () => {
    const dataset = {
      ...validDataset,
      data: [{ year: 2020, value: -10 }],
    };
    const errors = validateAnnualDataset(dataset);
    expect(errors.some((e) => e.field.includes('value'))).toBe(true);
  });

  it('should return error for duplicate years', () => {
    const dataset = {
      ...validDataset,
      data: [
        { year: 2020, value: 100 },
        { year: 2020, value: 105 },
      ],
    };
    const errors = validateAnnualDataset(dataset);
    expect(errors.some((e) => e.message.includes('Duplicate year'))).toBe(true);
  });

  it('should return error for unsorted data', () => {
    const dataset = {
      ...validDataset,
      data: [
        { year: 2021, value: 105 },
        { year: 2020, value: 100 },
      ],
    };
    const errors = validateAnnualDataset(dataset);
    expect(errors.some((e) => e.message.includes('not sorted'))).toBe(true);
  });
});

describe('validateCalculationData', () => {
  const validData: CalculationData = {
    retrievedAt: '2026-06-06',
    startYear: 2020,
    latestCompleteYear: 2020,
    units: {
      cpiIndex: 'index',
      goldUsdPerTroyOunce: 'USD per troy ounce',
      eurUsdRate: 'USD per EUR',
      espUsdRate: 'ESP per USD',
      goldEurPerGram: 'EUR per gram',
    },
    sourceIds: ['cpi', 'gold', 'eur-usd', 'esp-usd'],
    data: [
      {
        year: 2020,
        cpiIndex: 100,
        goldUsdPerTroyOunce: 1800,
        eurUsdRate: 1.2,
        espUsdRate: null,
        goldEurPerGram: 48.48,
      },
    ],
  };

  it('should return no errors for valid data', () => {
    const errors = validateCalculationData(validData);
    expect(errors).toHaveLength(0);
  });

  it('should return error for missing retrievedAt', () => {
    const data = { ...validData, retrievedAt: '' };
    const errors = validateCalculationData(data);
    expect(errors).toContainEqual({
      field: 'retrievedAt',
      message: 'Missing retrievedAt',
    });
  });

  it('should return error for invalid startYear', () => {
    const data = { ...validData, startYear: NaN };
    const errors = validateCalculationData(data);
    expect(errors).toContainEqual({
      field: 'startYear',
      message: 'Invalid startYear',
    });
  });

  it('should return error when startYear > latestCompleteYear', () => {
    const data = { ...validData, startYear: 2022, latestCompleteYear: 2020 };
    const errors = validateCalculationData(data);
    expect(errors.some((e) => e.message.includes('startYear must be'))).toBe(
      true,
    );
  });

  it('should return error for empty data', () => {
    const data = { ...validData, data: [] };
    const errors = validateCalculationData(data);
    expect(errors).toContainEqual({
      field: 'data',
      message: 'No data points',
    });
  });
});

describe('validateMetadata', () => {
  const validMetadata: Metadata = {
    retrievedAt: '2026-06-06',
    startYear: 2020,
    latestCompleteYear: 2021,
    methodologyVersion: '1.0',
    sources: [
      {
        id: 'test',
        name: 'Test Source',
        url: 'https://example.com',
      },
    ],
  };

  it('should return no errors for valid metadata', () => {
    const errors = validateMetadata(validMetadata);
    expect(errors).toHaveLength(0);
  });

  it('should return error for missing retrievedAt', () => {
    const metadata = { ...validMetadata, retrievedAt: '' };
    const errors = validateMetadata(metadata);
    expect(errors).toContainEqual({
      field: 'retrievedAt',
      message: 'Missing retrievedAt',
    });
  });

  it('should return error for missing methodologyVersion', () => {
    const metadata = { ...validMetadata, methodologyVersion: '' };
    const errors = validateMetadata(metadata);
    expect(errors).toContainEqual({
      field: 'methodologyVersion',
      message: 'Missing methodologyVersion',
    });
  });

  it('should return error for empty sources', () => {
    const metadata = { ...validMetadata, sources: [] };
    const errors = validateMetadata(metadata);
    expect(errors).toContainEqual({
      field: 'sources',
      message: 'No sources defined',
    });
  });
});

describe('validateConstants', () => {
  it('should return no errors for correct constants', () => {
    const errors = validateConstants();
    expect(errors).toHaveLength(0);
  });
});

describe('validateAllData', () => {
  const createValidDataset = (id: string, value = 100): AnnualDataset => ({
    id,
    source: 'Test Source',
    sourceUrl: 'https://example.com',
    retrievedAt: '2026-06-06',
    units: 'test',
    frequency: 'annual',
    data: [{ year: 2020, value }],
  });

  const createValidCalculationData = (): CalculationData => ({
    retrievedAt: '2026-06-06',
    startYear: 2020,
    latestCompleteYear: 2020,
    units: {
      cpiIndex: 'index',
      goldUsdPerTroyOunce: 'USD per troy ounce',
      eurUsdRate: 'USD per EUR',
      espUsdRate: 'ESP per USD',
      goldEurPerGram: 'EUR per gram',
    },
    sourceIds: ['cpi', 'gold', 'eur-usd', 'esp-usd'],
    data: [
      {
        year: 2020,
        cpiIndex: 100,
        goldUsdPerTroyOunce: 1800,
        eurUsdRate: 1.2,
        espUsdRate: null,
        goldEurPerGram: 1800 / 1.2 / 31.1035,
      },
    ],
  });

  const createValidMetadata = (): Metadata => ({
    retrievedAt: '2026-06-06',
    startYear: 2020,
    latestCompleteYear: 2020,
    methodologyVersion: '1.0',
    sources: [
      {
        id: 'test',
        name: 'Test Source',
        url: 'https://example.com',
      },
    ],
  });

  it('should return no errors for valid data', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'CC BY 4.0',
      attribution: 'Test attribution',
      units: 'USD per troy ounce',
    };

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors).toHaveLength(0);
  });

  it('should return error when derived goldEurPerGram is corrupted', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'CC BY 4.0',
      attribution: 'Test attribution',
      units: 'USD per troy ounce',
    };
    const calculationData = createValidCalculationData();
    calculationData.data[0].goldEurPerGram = 999;

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      calculationData,
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('goldEurPerGram'))).toBe(true);
  });

  it('should return error when a source dataset includes a future incomplete year', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'CC BY 4.0',
      attribution: 'Test attribution',
      units: 'USD per troy ounce',
    };
    const eurUsdData = createValidDataset('eur-usd', 1.2);
    eurUsdData.data.push({ year: 2021, value: 1.1 });

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      eurUsdData,
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('latestCompleteYear'))).toBe(
      true,
    );
  });

  it('should return error when gold source is World Gold Council', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Gold Council',
      license: 'CC BY 4.0',
      attribution: 'Test attribution',
      units: 'USD per troy ounce',
    };

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('World Gold Council'))).toBe(
      true,
    );
  });

  it('should return error when gold license is not CC BY 4.0', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'MIT',
      attribution: 'Test attribution',
      units: 'USD per troy ounce',
    };

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('CC BY 4.0'))).toBe(true);
  });

  it('should return error when gold attribution is missing', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'CC BY 4.0',
      attribution: '',
      units: 'USD per troy ounce',
    };

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('attribution'))).toBe(true);
  });

  it('should return error when gold units are not USD per troy ounce', () => {
    const goldData = {
      ...createValidDataset('gold', 1800),
      source: 'World Bank Commodity Markets',
      license: 'CC BY 4.0',
      attribution: 'Test attribution',
      units: 'EUR per gram',
    };

    const errors = validateAllData(
      createValidDataset('cpi', 100),
      goldData,
      createValidDataset('eur-usd', 1.2),
      createValidDataset('esp-usd'),
      createValidCalculationData(),
      createValidMetadata(),
    );

    expect(errors.some((e) => e.message.includes('USD per troy ounce'))).toBe(
      true,
    );
  });
});
