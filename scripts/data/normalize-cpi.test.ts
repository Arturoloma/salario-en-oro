import { describe, expect, it } from 'vitest';

import { normalizeCpiData } from './normalize-cpi.js';
import type { IneApiResponse, IneCpiApiResponse } from './normalize-cpi.js';

function months(
  year: number,
  startValue: number,
): Array<{ Anyo: number; FK_Periodo: number; Valor: string | number }> {
  return Array.from({ length: 12 }, (_, index) => ({
    Anyo: year,
    FK_Periodo: index + 1,
    Valor: startValue + index,
  }));
}

function response(
  indexData: IneApiResponse,
  variationData: IneApiResponse = [
    { COD: 'IPC290752', Data: [{ Anyo: 1900, FK_Periodo: 1, Valor: 0 }] },
  ],
): IneCpiApiResponse {
  return { index: indexData, monthlyVariation: variationData };
}

describe('normalizeCpiData', () => {
  it('should average complete monthly CPI data from INE response', () => {
    const ineResponse = response([
      {
        Data: [...months(1975, 10), ...months(1976, 20), ...months(1977, 30)],
      },
    ]);

    const result = normalizeCpiData(ineResponse, '2026-06-06');

    expect(result.id).toBe('cpi-spain-annual');
    expect(result.source).toBe('Instituto Nacional de Estadística');
    expect(result.sourceUrl).toBe(
      'https://servicios.ine.es/wstempus/jsCache/es/DATOS_TABLA/24077?tip=AM&',
    );
    expect(result.retrievedAt).toBe('2026-06-06');
    expect(result.units).toBe('index');
    expect(result.frequency).toBe('annual');
    expect(result.data).toHaveLength(3);
    expect(result.data[0]).toEqual({ year: 1975, value: 15.5 });
    expect(result.data[1]).toEqual({ year: 1976, value: 25.5 });
    expect(result.data[2]).toEqual({ year: 1977, value: 35.5 });
  });

  it('should sort data by year', () => {
    const ineResponse = response([
      {
        Data: [...months(1977, 30), ...months(1975, 10), ...months(1976, 20)],
      },
    ]);

    const result = normalizeCpiData(ineResponse, '2026-06-06');

    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1976);
    expect(result.data[2].year).toBe(1977);
  });

  it('should skip incomplete years', () => {
    const ineResponse = response([
      {
        Data: [...months(1975, 10), ...months(1976, 20).slice(0, 11)],
      },
    ]);

    const result = normalizeCpiData(ineResponse, '2026-06-06');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].year).toBe(1975);
  });

  it('should skip items with invalid values', () => {
    const invalidYear = months(1976, 20);
    invalidYear[0] = { Anyo: 1976, FK_Periodo: 1, Valor: 'invalid' };
    const ineResponse = response([
      {
        Data: [...months(1975, 10), ...invalidYear, ...months(1979, 40)],
      },
    ]);

    const result = normalizeCpiData(ineResponse, '2026-06-06');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(1975);
    expect(result.data[1].year).toBe(1979);
  });

  it('should throw when duplicate month rows are found', () => {
    const duplicateMonthYear = months(1975, 10).filter(
      (item) => item.FK_Periodo !== 12,
    );
    duplicateMonthYear.push({ Anyo: 1975, FK_Periodo: 1, Valor: 99 });
    const ineResponse = response([
      {
        Data: [...duplicateMonthYear, ...months(1976, 20)],
      },
    ]);

    expect(() => normalizeCpiData(ineResponse, '2026-06-06')).toThrow(
      'Duplicate CPI month found: 1975-01',
    );
  });

  it('should backfill missing index months from monthly variation data', () => {
    const indexData: IneApiResponse = [
      {
        Data: months(2002, 100),
      },
    ];
    const variationData: IneApiResponse = [
      {
        COD: 'IPC290752',
        Data: [...months(2002, 0), ...months(2001, 0)].map((item) => ({
          ...item,
          Valor: 1,
        })),
      },
    ];

    const result = normalizeCpiData(
      response(indexData, variationData),
      '2026-06-06',
    );

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(2001);
    expect(result.data[0].value).toBeGreaterThan(90);
    expect(result.data[1]).toEqual({ year: 2002, value: 105.5 });
  });

  it('should throw error when no data is found', () => {
    const ineResponse = response([]);

    expect(() => normalizeCpiData(ineResponse, '2026-06-06')).toThrow(
      'No data found in INE API response',
    );
  });

  it('should throw error when series data is empty', () => {
    const ineResponse = response([{ Data: [] }]);

    expect(() => normalizeCpiData(ineResponse, '2026-06-06')).toThrow(
      'No series data found in INE API response',
    );
  });

  it('should throw error when no valid data is found', () => {
    const ineResponse = response([
      {
        Data: [
          { Periodo: 'invalid', FK_Periodo: 1, Valor: '12.34' },
          { Anyo: 1976, FK_Periodo: 1, Valor: 'invalid' },
        ],
      },
    ]);

    expect(() => normalizeCpiData(ineResponse, '2026-06-06')).toThrow(
      'No valid CPI data found in response',
    );
  });
});
