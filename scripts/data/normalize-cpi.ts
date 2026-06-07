import {
  type AnnualDataset,
  CPI_SOURCE_METADATA,
  type YearValue,
} from './types.js';

export type IneApiResponse = Array<{
  COD?: string;
  Data?: Array<{
    Anyo?: number;
    FK_Periodo?: number;
    T3_Periodo?: string;
    Periodo?: string;
    Valor?: string | number;
  }>;
}>;

export type IneCpiApiResponse = {
  index: IneApiResponse;
  monthlyVariation: IneApiResponse;
};

export function normalizeCpiData(
  ineResponse: IneCpiApiResponse,
  retrievedAt: string,
): AnnualDataset {
  const monthlyValuesByYear = new Map<number, Map<number, number>>();
  const monthlyIndexValues = parseMonthlyIndexValues(ineResponse.index);

  backfillMonthlyIndexValues(
    monthlyIndexValues,
    parseMonthlyVariationValues(ineResponse.monthlyVariation),
  );

  for (const [key, value] of monthlyIndexValues) {
    const [yearText, monthText] = key.split('-');
    const year = Number(yearText);
    const month = Number(monthText);

    if (!monthlyValuesByYear.has(year)) {
      monthlyValuesByYear.set(year, new Map());
    }

    monthlyValuesByYear.get(year)!.set(month, value);
  }

  const data: YearValue[] = [];

  for (const [year, monthlyValues] of monthlyValuesByYear) {
    if (monthlyValues.size !== 12) {
      continue;
    }

    const annualAverage =
      [...monthlyValues.values()].reduce((sum, value) => sum + value, 0) /
      monthlyValues.size;
    data.push({ year, value: annualAverage });
  }

  if (data.length === 0) {
    throw new Error('No valid CPI data found in response');
  }

  data.sort((a, b) => a.year - b.year);

  return {
    id: 'cpi-spain-annual',
    source: CPI_SOURCE_METADATA.source,
    sourceUrl: CPI_SOURCE_METADATA.sourceUrl,
    retrievedAt,
    units: 'index',
    license: CPI_SOURCE_METADATA.license,
    licenseUrl: CPI_SOURCE_METADATA.licenseUrl,
    attribution: CPI_SOURCE_METADATA.attribution,
    frequency: 'annual',
    data,
  };
}

function parseMonthlyIndexValues(ineResponse: IneApiResponse) {
  const monthlyIndexValues = new Map<string, number>();

  if (ineResponse.length === 0) {
    throw new Error('No data found in INE API response');
  }

  const seriesData = ineResponse[0]?.Data;
  if (!seriesData || seriesData.length === 0) {
    throw new Error('No series data found in INE API response');
  }

  for (const item of seriesData) {
    const year = item.Anyo ?? Number(item.Periodo);
    const value = Number(item.Valor);

    if (!Number.isFinite(year) || !Number.isInteger(year)) {
      continue;
    }

    const month = parseMonth(item);
    if (month === null) {
      continue;
    }

    if (!Number.isFinite(value) || value <= 0) {
      continue;
    }

    const key = monthKey(year, month);
    if (monthlyIndexValues.has(key)) {
      throw new Error(`Duplicate CPI month found: ${key}`);
    }

    monthlyIndexValues.set(key, value);
  }

  if (monthlyIndexValues.size === 0) {
    throw new Error('No valid CPI data found in response');
  }

  return monthlyIndexValues;
}

function parseMonthlyVariationValues(ineResponse: IneApiResponse) {
  const monthlyVariationSeries = ineResponse.find(
    (series) => series.COD === 'IPC290752',
  );
  const seriesData = monthlyVariationSeries?.Data;

  if (!seriesData || seriesData.length === 0) {
    throw new Error('No monthly variation data found in INE API response');
  }

  const monthlyVariationValues = new Map<string, number>();

  for (const item of seriesData) {
    const year = item.Anyo ?? Number(item.Periodo);
    const month = parseMonth(item);
    const value = Number(item.Valor);

    if (
      !Number.isFinite(year) ||
      !Number.isInteger(year) ||
      month === null ||
      !Number.isFinite(value)
    ) {
      continue;
    }

    monthlyVariationValues.set(monthKey(year, month), value);
  }

  return monthlyVariationValues;
}

function backfillMonthlyIndexValues(
  monthlyIndexValues: Map<string, number>,
  monthlyVariationValues: Map<string, number>,
) {
  const sortedVariations = [...monthlyVariationValues.entries()].sort(
    ([leftKey], [rightKey]) => compareMonthKeys(rightKey, leftKey),
  );

  for (const [currentKey, variationPercent] of sortedVariations) {
    const currentValue = monthlyIndexValues.get(currentKey);
    if (currentValue === undefined) {
      continue;
    }

    const previousKey = previousMonthKey(currentKey);
    if (monthlyIndexValues.has(previousKey)) {
      continue;
    }

    monthlyIndexValues.set(
      previousKey,
      currentValue / (1 + variationPercent / 100),
    );
  }
}

function parseMonth(item: {
  FK_Periodo?: number;
  T3_Periodo?: string;
}): number | null {
  const period = item.FK_Periodo;
  if (
    typeof period === 'number' &&
    Number.isInteger(period) &&
    period >= 1 &&
    period <= 12
  ) {
    return period;
  }

  if (item.T3_Periodo?.startsWith('M')) {
    const month = Number(item.T3_Periodo.slice(1));
    if (Number.isInteger(month) && month >= 1 && month <= 12) {
      return month;
    }
  }

  return null;
}

function monthKey(year: number, month: number) {
  return `${year}-${month.toString().padStart(2, '0')}`;
}

function previousMonthKey(key: string) {
  const [yearText, monthText] = key.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (month === 1) {
    return monthKey(year - 1, 12);
  }

  return monthKey(year, month - 1);
}

function compareMonthKeys(leftKey: string, rightKey: string) {
  return leftKey.localeCompare(rightKey);
}

export async function fetchCpiData(): Promise<IneCpiApiResponse> {
  const [index, monthlyVariation] = await Promise.all([
    fetchIneData(
      'https://servicios.ine.es/wstempus/jsCache/es/DATOS_TABLA/24077?tip=AM&',
    ),
    fetchIneData(
      'https://servicios.ine.es/wstempus/jsCache/es/DATOS_TABLA/76134?tip=AM&',
    ),
  ]);

  return { index, monthlyVariation };
}

async function fetchIneData(url: string): Promise<IneApiResponse> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CPI data: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as IneApiResponse;
}
