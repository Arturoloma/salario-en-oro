import type { AnnualDataset, CalculationData, Metadata } from './types';

let cachedCalculationData: CalculationData | null = null;
let cachedMetadata: Metadata | null = null;
let cachedCpiData: AnnualDataset | null = null;
let cachedGoldData: AnnualDataset | null = null;

export async function loadCalculationData(): Promise<CalculationData> {
  if (cachedCalculationData) {
    return cachedCalculationData;
  }

  const response = await fetch('/data/calculation-data.json');
  if (!response.ok) {
    throw new Error('Failed to load calculation data');
  }

  const data = await response.json();
  assertCalculationData(data);
  cachedCalculationData = data;
  return cachedCalculationData;
}

export async function loadMetadata(): Promise<Metadata> {
  if (cachedMetadata) {
    return cachedMetadata;
  }

  const response = await fetch('/data/metadata.json');
  if (!response.ok) {
    throw new Error('Failed to load metadata');
  }

  const data = await response.json();
  assertMetadata(data);
  cachedMetadata = data;
  return cachedMetadata;
}

export async function loadCpiData(): Promise<AnnualDataset> {
  if (cachedCpiData) {
    return cachedCpiData;
  }

  const response = await fetch('/data/cpi-spain-annual.json');
  if (!response.ok) {
    throw new Error('Failed to load CPI data');
  }

  const data = await response.json();
  assertAnnualDataset(data);
  cachedCpiData = data;
  return cachedCpiData;
}

export async function loadGoldData(): Promise<AnnualDataset> {
  if (cachedGoldData) {
    return cachedGoldData;
  }

  const response = await fetch('/data/gold-annual.json');
  if (!response.ok) {
    throw new Error('Failed to load gold data');
  }

  const data = await response.json();
  assertAnnualDataset(data);
  cachedGoldData = data;
  return cachedGoldData;
}

export function clearCache(): void {
  cachedCalculationData = null;
  cachedMetadata = null;
  cachedCpiData = null;
  cachedGoldData = null;
}

function assertAnnualDataset(value: unknown): asserts value is AnnualDataset {
  if (!isRecord(value)) {
    throw new Error('Invalid annual dataset: expected object');
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.source !== 'string' ||
    typeof value.sourceUrl !== 'string' ||
    typeof value.retrievedAt !== 'string' ||
    typeof value.units !== 'string' ||
    value.frequency !== 'annual' ||
    !Array.isArray(value.data)
  ) {
    throw new Error('Invalid annual dataset: missing required fields');
  }
}

function assertCalculationData(
  value: unknown,
): asserts value is CalculationData {
  if (!isRecord(value)) {
    throw new Error('Invalid calculation data: expected object');
  }

  if (
    typeof value.retrievedAt !== 'string' ||
    !Number.isInteger(value.startYear) ||
    !Number.isInteger(value.latestCompleteYear) ||
    !isRecord(value.units) ||
    !Array.isArray(value.sourceIds) ||
    !Array.isArray(value.data)
  ) {
    throw new Error('Invalid calculation data: missing required fields');
  }
}

function assertMetadata(value: unknown): asserts value is Metadata {
  if (!isRecord(value)) {
    throw new Error('Invalid metadata: expected object');
  }

  if (
    typeof value.retrievedAt !== 'string' ||
    !Number.isInteger(value.startYear) ||
    !Number.isInteger(value.latestCompleteYear) ||
    typeof value.methodologyVersion !== 'string' ||
    !Array.isArray(value.sources)
  ) {
    throw new Error('Invalid metadata: missing required fields');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
