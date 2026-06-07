import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearCache,
  loadCalculationData,
  loadCpiData,
  loadGoldData,
  loadMetadata,
} from './data';

const payloads = {
  '/data/calculation-data.json': {
    retrievedAt: '2026-06-06',
    startYear: 1975,
    latestCompleteYear: 2025,
    units: {
      cpiIndex: 'index',
      goldUsdPerTroyOunce: 'USD per troy ounce',
      eurUsdRate: 'USD per EUR',
      espUsdRate: 'ESP per USD',
      goldEurPerGram: 'EUR per gram',
    },
    sourceIds: ['cpi-spain-annual', 'gold-annual'],
    data: [],
  },
  '/data/metadata.json': {
    retrievedAt: '2026-06-06',
    startYear: 1975,
    latestCompleteYear: 2025,
    methodologyVersion: '1.0.0',
    sources: [],
  },
  '/data/cpi-spain-annual.json': {
    id: 'cpi-spain-annual',
    source: 'Instituto Nacional de Estadística',
    sourceUrl: 'https://www.ine.es/',
    retrievedAt: '2026-06-06',
    units: 'index',
    frequency: 'annual',
    data: [],
  },
  '/data/gold-annual.json': {
    id: 'gold-annual',
    source: 'World Bank Commodity Markets',
    sourceUrl: 'https://www.worldbank.org/en/research/commodity-markets',
    retrievedAt: '2026-06-06',
    units: 'USD per troy ounce',
    frequency: 'annual',
    data: [],
  },
};

describe('data loaders', () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it('should load all static data files', async () => {
    const fetchMock = mockFetch();

    await expect(loadCalculationData()).resolves.toEqual(
      payloads['/data/calculation-data.json'],
    );
    await expect(loadMetadata()).resolves.toEqual(
      payloads['/data/metadata.json'],
    );
    await expect(loadCpiData()).resolves.toEqual(
      payloads['/data/cpi-spain-annual.json'],
    );
    await expect(loadGoldData()).resolves.toEqual(
      payloads['/data/gold-annual.json'],
    );

    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('should reuse cached responses until cache is cleared', async () => {
    const fetchMock = mockFetch();

    await loadCalculationData();
    await loadCalculationData();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    clearCache();
    await loadCalculationData();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should throw when a static data file cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(loadCalculationData()).rejects.toThrow(
      'Failed to load calculation data',
    );
    await expect(loadMetadata()).rejects.toThrow('Failed to load metadata');
    await expect(loadCpiData()).rejects.toThrow('Failed to load CPI data');
    await expect(loadGoldData()).rejects.toThrow('Failed to load gold data');
  });

  it('should throw when calculation data has an invalid shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }),
    );

    await expect(loadCalculationData()).rejects.toThrow(
      'Invalid calculation data',
    );
  });

  it('should throw when metadata has an invalid shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ sources: [] }) }),
    );

    await expect(loadMetadata()).rejects.toThrow('Invalid metadata');
  });

  it('should throw when an annual dataset has an invalid shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }),
    );

    await expect(loadCpiData()).rejects.toThrow('Invalid annual dataset');
  });
});

function mockFetch() {
  const fetchMock = vi.fn(async (url: keyof typeof payloads) => ({
    ok: true,
    json: async () => payloads[url],
  }));

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
