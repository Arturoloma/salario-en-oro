import xlsx from 'xlsx';
import { describe, expect, it } from 'vitest';

import { normalizeGoldData } from './normalize-gold.js';

function createTestWorkbook(
  data: Array<{ year: number; gold: number | string | null }>,
): Buffer {
  const wb = xlsx.utils.book_new();
  const wsData: Array<Array<number | string | null>> = [
    ['World Bank Commodity Price Data (The Pink Sheet)'],
    ['annual prices, 1960 to present, nominal US dollars'],
    ['(annual series are available in nominal and real dollars)'],
    ['Updated on March 03, 2026'],
    [],
    [],
    [],
    [],
  ];

  for (let i = 0; i < 67; i++) {
    wsData[6].push(`Col${i}`);
    wsData[7].push(`Unit${i}`);
  }

  for (const row of data) {
    const rowData: Array<number | string | null> = [row.year];
    for (let i = 1; i < 67; i++) {
      rowData.push(null);
    }
    rowData.push(row.gold);
    wsData.push(rowData);
  }

  const ws = xlsx.utils.aoa_to_sheet(wsData);
  xlsx.utils.book_append_sheet(wb, ws, 'Annual Prices (Nominal)');

  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(buffer);
}

describe('normalizeGoldData', () => {
  it('should parse valid gold data from workbook', () => {
    const buffer = createTestWorkbook([
      { year: 1975, gold: 161.03 },
      { year: 1976, gold: 124.82 },
      { year: 1977, gold: 147.72 },
    ]);

    const result = normalizeGoldData(buffer, '2026-06-06');

    expect(result.id).toBe('gold-annual');
    expect(result.source).toBe('World Bank Commodity Markets');
    expect(result.sourceUrl).toBe(
      'https://www.worldbank.org/en/research/commodity-markets',
    );
    expect(result.retrievedAt).toBe('2026-06-06');
    expect(result.units).toBe('USD per troy ounce');
    expect(result.frequency).toBe('annual');
    expect(result.license).toBe('CC BY 4.0');
    expect(result.licenseUrl).toBe(
      'https://creativecommons.org/licenses/by/4.0/',
    );
    expect(result.attribution).toBe(
      'The World Bank: Commodity Markets Pink Sheet: annual prices.',
    );
    expect(result.data).toHaveLength(3);
    expect(result.data[0]).toEqual({ year: 1975, value: 161.03 });
    expect(result.data[1]).toEqual({ year: 1976, value: 124.82 });
    expect(result.data[2]).toEqual({ year: 1977, value: 147.72 });
  });

  it('should sort data by year', () => {
    const buffer = createTestWorkbook([
      { year: 1977, gold: 147.72 },
      { year: 1975, gold: 161.03 },
      { year: 1976, gold: 124.82 },
    ]);

    const result = normalizeGoldData(buffer, '2026-06-06');

    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1976);
    expect(result.data[2].year).toBe(1977);
  });

  it('should skip rows with missing gold values', () => {
    const buffer = createTestWorkbook([
      { year: 1975, gold: 161.03 },
      { year: 1976, gold: null },
      { year: 1977, gold: 147.72 },
    ]);

    const result = normalizeGoldData(buffer, '2026-06-06');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1977);
  });

  it('should skip rows with invalid gold values', () => {
    const buffer = createTestWorkbook([
      { year: 1975, gold: 161.03 },
      { year: 1976, gold: 'invalid' },
      { year: 1977, gold: -10 },
      { year: 1978, gold: 0 },
      { year: 1979, gold: 147.72 },
    ]);

    const result = normalizeGoldData(buffer, '2026-06-06');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1979);
  });

  it('should skip rows with missing year values', () => {
    const wsData: Array<Array<number | string | null>> = [
      ['World Bank Commodity Price Data (The Pink Sheet)'],
      ['annual prices, 1960 to present, nominal US dollars'],
      ['(annual series are available in nominal and real dollars)'],
      ['Updated on March 03, 2026'],
      [],
      [],
      [],
      [],
    ];

    for (let i = 0; i < 67; i++) {
      wsData[6].push(`Col${i}`);
      wsData[7].push(`Unit${i}`);
    }

    wsData.push([1975, ...Array(66).fill(null), 161.03]);
    wsData.push([null, ...Array(66).fill(null), 124.82]);
    wsData.push([1977, ...Array(66).fill(null), 147.72]);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'Annual Prices (Nominal)');

    const testBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const result = normalizeGoldData(Buffer.from(testBuffer), '2026-06-06');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1977);
  });

  it('should throw error on duplicate years', () => {
    const wsData: Array<Array<number | string | null>> = [
      ['World Bank Commodity Price Data (The Pink Sheet)'],
      ['annual prices, 1960 to present, nominal US dollars'],
      ['(annual series are available in nominal and real dollars)'],
      ['Updated on March 03, 2026'],
      [],
      [],
      [],
      [],
    ];

    for (let i = 0; i < 67; i++) {
      wsData[6].push(`Col${i}`);
      wsData[7].push(`Unit${i}`);
    }

    wsData.push([1975, ...Array(66).fill(null), 161.03]);
    wsData.push([1975, ...Array(66).fill(null), 124.82]);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'Annual Prices (Nominal)');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    expect(() => normalizeGoldData(Buffer.from(buffer), '2026-06-06')).toThrow(
      'Duplicate year found: 1975',
    );
  });

  it('should throw error when sheet is missing', () => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([['test']]);
    xlsx.utils.book_append_sheet(wb, ws, 'Other Sheet');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    expect(() => normalizeGoldData(Buffer.from(buffer), '2026-06-06')).toThrow(
      'Sheet "Annual Prices (Nominal)" not found in workbook',
    );
  });

  it('should throw error when no valid data is found', () => {
    const buffer = createTestWorkbook([]);

    expect(() => normalizeGoldData(buffer, '2026-06-06')).toThrow(
      'No valid gold data found in workbook',
    );
  });
});
