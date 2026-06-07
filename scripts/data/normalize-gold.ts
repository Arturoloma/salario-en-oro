import xlsx from 'xlsx';

import {
  type AnnualDataset,
  GOLD_SOURCE_METADATA,
  type YearValue,
} from './types.js';

const GOLD_COLUMN_INDEX = 67;
const DATA_START_ROW = 8;
const SHEET_NAME = 'Annual Prices (Nominal)';

export function normalizeGoldData(
  xlsxBuffer: Buffer,
  retrievedAt: string,
): AnnualDataset {
  const workbook = xlsx.read(xlsxBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets[SHEET_NAME];

  if (!sheet) {
    throw new Error(`Sheet "${SHEET_NAME}" not found in workbook`);
  }

  const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1');
  const data: YearValue[] = [];
  const seenYears = new Set<number>();

  for (let row = DATA_START_ROW; row <= range.e.r; row++) {
    const yearAddr = xlsx.utils.encode_cell({ r: row, c: 0 });
    const goldAddr = xlsx.utils.encode_cell({ r: row, c: GOLD_COLUMN_INDEX });

    const yearCell = sheet[yearAddr];
    const goldCell = sheet[goldAddr];

    if (!yearCell || yearCell.v === undefined || yearCell.v === null) {
      continue;
    }

    const year = Number(yearCell.v);
    if (!Number.isFinite(year) || !Number.isInteger(year)) {
      continue;
    }

    if (!goldCell || goldCell.v === undefined || goldCell.v === null) {
      continue;
    }

    const value = Number(goldCell.v);
    if (!Number.isFinite(value) || value <= 0) {
      continue;
    }

    if (seenYears.has(year)) {
      throw new Error(`Duplicate year found: ${year}`);
    }

    seenYears.add(year);
    data.push({ year, value });
  }

  if (data.length === 0) {
    throw new Error('No valid gold data found in workbook');
  }

  data.sort((a, b) => a.year - b.year);

  return {
    id: 'gold-annual',
    source: GOLD_SOURCE_METADATA.source,
    sourceUrl: GOLD_SOURCE_METADATA.sourceUrl,
    retrievedAt,
    units: 'USD per troy ounce',
    frequency: 'annual',
    license: GOLD_SOURCE_METADATA.license,
    licenseUrl: GOLD_SOURCE_METADATA.licenseUrl,
    termsUrl: GOLD_SOURCE_METADATA.termsUrl,
    attribution: GOLD_SOURCE_METADATA.attribution,
    data,
  };
}

export async function fetchGoldData(): Promise<Buffer> {
  const url =
    'https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Annual.xlsx';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch gold data: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
