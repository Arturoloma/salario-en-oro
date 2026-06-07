import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  type AnnualDataset,
  type CalculationData,
  type Metadata,
} from './types.js';
import { validateAllData } from './validate-data.js';

const DATA_DIR = join(process.cwd(), 'public', 'data');

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = join(DATA_DIR, filename);
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function validateDataFiles(): Promise<void> {
  console.log('Reading data files...');

  const cpiData = await readJsonFile<AnnualDataset>('cpi-spain-annual.json');
  const goldData = await readJsonFile<AnnualDataset>('gold-annual.json');
  const eurUsdData = await readJsonFile<AnnualDataset>('eur-usd-annual.json');
  const espUsdData = await readJsonFile<AnnualDataset>('esp-usd-annual.json');
  const calculationData = await readJsonFile<CalculationData>(
    'calculation-data.json',
  );
  const metadata = await readJsonFile<Metadata>('metadata.json');

  console.log('Validating data...');
  const errors = validateAllData(
    cpiData,
    goldData,
    eurUsdData,
    espUsdData,
    calculationData,
    metadata,
  );

  if (errors.length > 0) {
    console.error('Validation errors:');
    for (const error of errors) {
      console.error(`  ${error.field}: ${error.message}`);
    }
    throw new Error(`Validation failed with ${errors.length} errors`);
  }

  console.log('All data files are valid!');
  console.log(`Latest complete year: ${calculationData.latestCompleteYear}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateDataFiles().catch((error) => {
    console.error('Error validating data:', error);
    process.exit(1);
  });
}
