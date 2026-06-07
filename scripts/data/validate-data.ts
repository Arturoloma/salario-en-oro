import {
  EUR_TO_ESP,
  GOLD_COIN_FINE_GOLD_GRAMS,
  TROY_OUNCE_GRAMS,
} from '../../src/lib/constants.js';
import {
  type AnnualDataset,
  type CalculationData,
  type CalculationDataRow,
  type Metadata,
} from './types.js';

const VALUE_TOLERANCE = 0.000001;

export type ValidationError = {
  field: string;
  message: string;
};

export function validateAnnualDataset(
  dataset: AnnualDataset,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!dataset.id) {
    errors.push({ field: 'id', message: 'Missing dataset id' });
  }

  if (!dataset.source) {
    errors.push({ field: 'source', message: 'Missing source' });
  }

  if (!dataset.sourceUrl) {
    errors.push({ field: 'sourceUrl', message: 'Missing sourceUrl' });
  }

  if (!dataset.retrievedAt) {
    errors.push({ field: 'retrievedAt', message: 'Missing retrievedAt' });
  } else if (Number.isNaN(Date.parse(dataset.retrievedAt))) {
    errors.push({ field: 'retrievedAt', message: 'Invalid retrievedAt date' });
  }

  if (!dataset.units) {
    errors.push({ field: 'units', message: 'Missing units' });
  }

  if (dataset.frequency !== 'annual') {
    errors.push({ field: 'frequency', message: 'Frequency must be annual' });
  }

  if (!dataset.data || dataset.data.length === 0) {
    errors.push({ field: 'data', message: 'No data points' });
    return errors;
  }

  const seenYears = new Set<number>();

  for (let i = 0; i < dataset.data.length; i++) {
    const item = dataset.data[i];

    if (!Number.isFinite(item.year) || !Number.isInteger(item.year)) {
      errors.push({
        field: `data[${i}].year`,
        message: `Invalid year: ${item.year}`,
      });
    }

    if (!Number.isFinite(item.value) || item.value <= 0) {
      errors.push({
        field: `data[${i}].value`,
        message: `Invalid value: ${item.value}`,
      });
    }

    if (seenYears.has(item.year)) {
      errors.push({
        field: `data[${i}].year`,
        message: `Duplicate year: ${item.year}`,
      });
    }

    seenYears.add(item.year);

    if (i > 0 && item.year <= dataset.data[i - 1].year) {
      errors.push({
        field: `data[${i}].year`,
        message: 'Data is not sorted by year',
      });
    }
  }

  return errors;
}

export function validateCalculationData(
  data: CalculationData,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.retrievedAt) {
    errors.push({ field: 'retrievedAt', message: 'Missing retrievedAt' });
  }

  if (!Number.isFinite(data.startYear) || !Number.isInteger(data.startYear)) {
    errors.push({ field: 'startYear', message: 'Invalid startYear' });
  }

  if (
    !Number.isFinite(data.latestCompleteYear) ||
    !Number.isInteger(data.latestCompleteYear)
  ) {
    errors.push({
      field: 'latestCompleteYear',
      message: 'Invalid latestCompleteYear',
    });
  }

  if (data.startYear > data.latestCompleteYear) {
    errors.push({
      field: 'startYear',
      message: 'startYear must be <= latestCompleteYear',
    });
  }

  if (!data.data || data.data.length === 0) {
    errors.push({ field: 'data', message: 'No data points' });
    return errors;
  }

  if (data.data[0]?.year !== data.startYear) {
    errors.push({
      field: 'startYear',
      message: 'startYear must match first data year',
    });
  }

  if (data.data[data.data.length - 1]?.year !== data.latestCompleteYear) {
    errors.push({
      field: 'latestCompleteYear',
      message: 'latestCompleteYear must match last data year',
    });
  }

  const seenYears = new Set<number>();

  for (let i = 0; i < data.data.length; i++) {
    const row = data.data[i];

    if (!Number.isFinite(row.year) || !Number.isInteger(row.year)) {
      errors.push({ field: `data[${i}].year`, message: 'Invalid year' });
    }

    if (!Number.isFinite(row.cpiIndex) || row.cpiIndex <= 0) {
      errors.push({
        field: `data[${i}].cpiIndex`,
        message: 'Invalid cpiIndex',
      });
    }

    if (
      !Number.isFinite(row.goldUsdPerTroyOunce) ||
      row.goldUsdPerTroyOunce <= 0
    ) {
      errors.push({
        field: `data[${i}].goldUsdPerTroyOunce`,
        message: 'Invalid goldUsdPerTroyOunce',
      });
    }

    if (!Number.isFinite(row.goldEurPerGram) || row.goldEurPerGram <= 0) {
      errors.push({
        field: `data[${i}].goldEurPerGram`,
        message: 'Invalid goldEurPerGram',
      });
    }

    if (seenYears.has(row.year)) {
      errors.push({
        field: `data[${i}].year`,
        message: `Duplicate year: ${row.year}`,
      });
    }

    seenYears.add(row.year);

    if (i > 0 && row.year <= data.data[i - 1].year) {
      errors.push({
        field: `data[${i}].year`,
        message: 'Data is not sorted by year',
      });
    }

    if (i > 0 && row.year > data.data[i - 1].year + 1) {
      errors.push({
        field: `data[${i}].year`,
        message: `Missing year between ${data.data[i - 1].year} and ${row.year}`,
      });
    }
  }

  return errors;
}

export function validateMetadata(metadata: Metadata): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!metadata.retrievedAt) {
    errors.push({ field: 'retrievedAt', message: 'Missing retrievedAt' });
  }

  if (
    !Number.isFinite(metadata.startYear) ||
    !Number.isInteger(metadata.startYear)
  ) {
    errors.push({ field: 'startYear', message: 'Invalid startYear' });
  }

  if (
    !Number.isFinite(metadata.latestCompleteYear) ||
    !Number.isInteger(metadata.latestCompleteYear)
  ) {
    errors.push({
      field: 'latestCompleteYear',
      message: 'Invalid latestCompleteYear',
    });
  }

  if (!metadata.methodologyVersion) {
    errors.push({
      field: 'methodologyVersion',
      message: 'Missing methodologyVersion',
    });
  }

  if (!metadata.sources || metadata.sources.length === 0) {
    errors.push({ field: 'sources', message: 'No sources defined' });
  }

  for (let i = 0; i < (metadata.sources ?? []).length; i++) {
    const source = metadata.sources[i];
    if (!source.id) {
      errors.push({ field: `sources[${i}].id`, message: 'Missing source id' });
    }
    if (!source.name) {
      errors.push({
        field: `sources[${i}].name`,
        message: 'Missing source name',
      });
    }
    if (!source.url) {
      errors.push({
        field: `sources[${i}].url`,
        message: 'Missing source URL',
      });
    }
  }

  return errors;
}

export function validateConstants(): ValidationError[] {
  const errors: ValidationError[] = [];

  if (EUR_TO_ESP !== 166.386) {
    errors.push({
      field: 'EUR_TO_ESP',
      message: `Expected 166.386, got ${EUR_TO_ESP}`,
    });
  }

  if (TROY_OUNCE_GRAMS !== 31.1035) {
    errors.push({
      field: 'TROY_OUNCE_GRAMS',
      message: `Expected 31.1035, got ${TROY_OUNCE_GRAMS}`,
    });
  }

  if (GOLD_COIN_FINE_GOLD_GRAMS !== 5.81) {
    errors.push({
      field: 'GOLD_COIN_FINE_GOLD_GRAMS',
      message: `Expected 5.81, got ${GOLD_COIN_FINE_GOLD_GRAMS}`,
    });
  }

  return errors;
}

export function validateAllData(
  cpiData: AnnualDataset,
  goldData: AnnualDataset,
  eurUsdData: AnnualDataset,
  espUsdData: AnnualDataset,
  calculationData: CalculationData,
  metadata: Metadata,
): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(...validateAnnualDataset(cpiData));
  errors.push(...validateAnnualDataset(goldData));
  errors.push(...validateAnnualDataset(eurUsdData));
  errors.push(...validateAnnualDataset(espUsdData));
  errors.push(...validateCalculationData(calculationData));
  errors.push(...validateMetadata(metadata));
  errors.push(...validateConstants());

  errors.push(
    ...validateDatasetCutoff(cpiData, metadata.latestCompleteYear),
    ...validateDatasetCutoff(goldData, metadata.latestCompleteYear),
    ...validateDatasetCutoff(eurUsdData, metadata.latestCompleteYear),
    ...validateDatasetCutoff(espUsdData, metadata.latestCompleteYear),
    ...validateCalculationAgainstSources(
      cpiData,
      goldData,
      eurUsdData,
      espUsdData,
      calculationData,
    ),
  );

  if (goldData.source.toLowerCase().includes('world gold council')) {
    errors.push({
      field: 'goldData.source',
      message: 'World Gold Council is not allowed as a data source',
    });
  }

  if (goldData.license !== 'CC BY 4.0') {
    errors.push({
      field: 'goldData.license',
      message: 'Gold data must be licensed under CC BY 4.0',
    });
  }

  if (!goldData.attribution) {
    errors.push({
      field: 'goldData.attribution',
      message: 'Gold data must have attribution',
    });
  }

  if (goldData.units !== 'USD per troy ounce') {
    errors.push({
      field: 'goldData.units',
      message: 'Gold data units must be USD per troy ounce',
    });
  }

  return errors;
}

function validateDatasetCutoff(
  dataset: AnnualDataset,
  latestCompleteYear: number,
): ValidationError[] {
  return dataset.data
    .filter((item) => item.year > latestCompleteYear)
    .map((item) => ({
      field: `${dataset.id}.data.${item.year}`,
      message: `Dataset year ${item.year} is later than latestCompleteYear ${latestCompleteYear}`,
    }));
}

function validateCalculationAgainstSources(
  cpiData: AnnualDataset,
  goldData: AnnualDataset,
  eurUsdData: AnnualDataset,
  espUsdData: AnnualDataset,
  calculationData: CalculationData,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const cpiMap = new Map(cpiData.data.map((item) => [item.year, item.value]));
  const goldMap = new Map(goldData.data.map((item) => [item.year, item.value]));
  const eurUsdMap = new Map(
    eurUsdData.data.map((item) => [item.year, item.value]),
  );
  const espUsdMap = new Map(
    espUsdData.data.map((item) => [item.year, item.value]),
  );

  for (let i = 0; i < calculationData.data.length; i++) {
    const row = calculationData.data[i];
    const cpiIndex = cpiMap.get(row.year);
    const goldUsdPerTroyOunce = goldMap.get(row.year);

    if (cpiIndex === undefined) {
      errors.push({
        field: `data[${i}].cpiIndex`,
        message: `Missing source CPI for ${row.year}`,
      });
    } else if (!isClose(row.cpiIndex, cpiIndex)) {
      errors.push({
        field: `data[${i}].cpiIndex`,
        message: `cpiIndex does not match source CPI for ${row.year}`,
      });
    }

    if (goldUsdPerTroyOunce === undefined) {
      errors.push({
        field: `data[${i}].goldUsdPerTroyOunce`,
        message: `Missing source gold price for ${row.year}`,
      });
      continue;
    }

    if (!isClose(row.goldUsdPerTroyOunce, goldUsdPerTroyOunce)) {
      errors.push({
        field: `data[${i}].goldUsdPerTroyOunce`,
        message: `goldUsdPerTroyOunce does not match source gold price for ${row.year}`,
      });
    }

    const expectedGoldEurPerGram = calculateExpectedGoldEurPerGram(
      row,
      goldUsdPerTroyOunce,
      eurUsdMap.get(row.year),
      espUsdMap.get(row.year),
    );

    if (expectedGoldEurPerGram === null) {
      errors.push({
        field: `data[${i}].goldEurPerGram`,
        message: `Missing exchange rate for ${row.year}`,
      });
    } else if (!isClose(row.goldEurPerGram, expectedGoldEurPerGram)) {
      errors.push({
        field: `data[${i}].goldEurPerGram`,
        message: `goldEurPerGram does not match source rates for ${row.year}`,
      });
    }
  }

  return errors;
}

function calculateExpectedGoldEurPerGram(
  row: CalculationDataRow,
  goldUsdPerTroyOunce: number,
  eurUsdRate: number | undefined,
  espUsdRate: number | undefined,
): number | null {
  if (row.eurUsdRate !== null) {
    if (eurUsdRate === undefined || !isClose(row.eurUsdRate, eurUsdRate)) {
      return null;
    }
    return goldUsdPerTroyOunce / eurUsdRate / TROY_OUNCE_GRAMS;
  }

  if (row.espUsdRate !== null) {
    if (espUsdRate === undefined || !isClose(row.espUsdRate, espUsdRate)) {
      return null;
    }
    return (goldUsdPerTroyOunce * espUsdRate) / EUR_TO_ESP / TROY_OUNCE_GRAMS;
  }

  return null;
}

function isClose(left: number, right: number): boolean {
  return Math.abs(left - right) <= VALUE_TOLERANCE;
}
