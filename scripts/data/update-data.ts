import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildCalculationData } from './build-calculation-data.js';
import { fetchCpiData, normalizeCpiData } from './normalize-cpi.js';
import {
  fetchEurUsdData,
  fetchEspUsdData,
  normalizeEspUsdData,
  normalizeEurUsdData,
} from './normalize-exchange-rates.js';
import { fetchGoldData, normalizeGoldData } from './normalize-gold.js';
import {
  CPI_SOURCE_METADATA,
  EXCHANGE_RATE_SOURCE_METADATA,
  GOLD_SOURCE_METADATA,
  type Metadata,
} from './types.js';
import { validateAllData } from './validate-data.js';

const DATA_DIR = join(process.cwd(), 'public', 'data');

async function writeJsonFile(filename: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const filePath = join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export async function updateData(): Promise<void> {
  const retrievedAt = new Date().toISOString().split('T')[0];

  console.log('Fetching CPI data...');
  const cpiResponse = await fetchCpiData();
  const cpiData = normalizeCpiData(cpiResponse, retrievedAt);
  console.log(`CPI data: ${cpiData.data.length} years`);

  console.log('Fetching gold data...');
  const goldBuffer = await fetchGoldData();
  const goldData = normalizeGoldData(goldBuffer, retrievedAt);
  console.log(`Gold data: ${goldData.data.length} years`);

  console.log('Fetching EUR/USD data...');
  const eurUsdCsv = await fetchEurUsdData();
  const eurUsdData = normalizeEurUsdData(eurUsdCsv, retrievedAt);
  console.log(`EUR/USD data: ${eurUsdData.data.length} years`);

  console.log('Fetching ESP/USD data...');
  const espUsdRates = await fetchEspUsdData();
  const espUsdData = normalizeEspUsdData(espUsdRates, retrievedAt);
  console.log(`ESP/USD data: ${espUsdData.data.length} years`);

  console.log('Building calculation data...');
  const calculationData = buildCalculationData(
    cpiData,
    goldData,
    eurUsdData,
    espUsdData,
    retrievedAt,
  );
  console.log(
    `Calculation data: ${calculationData.data.length} years (${calculationData.startYear}-${calculationData.latestCompleteYear})`,
  );

  const metadata: Metadata = {
    retrievedAt,
    startYear: calculationData.startYear,
    latestCompleteYear: calculationData.latestCompleteYear,
    methodologyVersion: '1.0',
    sources: [
      {
        id: 'cpi',
        name: CPI_SOURCE_METADATA.source,
        url: CPI_SOURCE_METADATA.sourceUrl,
        license: CPI_SOURCE_METADATA.license,
        licenseUrl: CPI_SOURCE_METADATA.licenseUrl,
        attribution: CPI_SOURCE_METADATA.attribution,
      },
      {
        id: 'gold',
        name: GOLD_SOURCE_METADATA.source,
        url: GOLD_SOURCE_METADATA.sourceUrl,
        license: GOLD_SOURCE_METADATA.license,
        licenseUrl: GOLD_SOURCE_METADATA.licenseUrl,
        termsUrl: GOLD_SOURCE_METADATA.termsUrl,
        attribution: GOLD_SOURCE_METADATA.attribution,
      },
      {
        id: 'eur-usd',
        name: EXCHANGE_RATE_SOURCE_METADATA.ecb.source,
        url: EXCHANGE_RATE_SOURCE_METADATA.ecb.sourceUrl,
        license: EXCHANGE_RATE_SOURCE_METADATA.ecb.license,
        licenseUrl: EXCHANGE_RATE_SOURCE_METADATA.ecb.licenseUrl,
        attribution: EXCHANGE_RATE_SOURCE_METADATA.ecb.attribution,
      },
      {
        id: 'esp-usd',
        name: EXCHANGE_RATE_SOURCE_METADATA.bde.source,
        url: EXCHANGE_RATE_SOURCE_METADATA.bde.sourceUrl,
        license: EXCHANGE_RATE_SOURCE_METADATA.bde.license,
        licenseUrl: EXCHANGE_RATE_SOURCE_METADATA.bde.licenseUrl,
        attribution: EXCHANGE_RATE_SOURCE_METADATA.bde.attribution,
      },
    ],
  };

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

  console.log('Writing data files...');
  await writeJsonFile('cpi-spain-annual.json', cpiData);
  await writeJsonFile('gold-annual.json', goldData);
  await writeJsonFile('eur-usd-annual.json', eurUsdData);
  await writeJsonFile('esp-usd-annual.json', espUsdData);
  await writeJsonFile('calculation-data.json', calculationData);
  await writeJsonFile('metadata.json', metadata);

  console.log('Data update complete!');
  console.log(`Latest complete year: ${calculationData.latestCompleteYear}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateData().catch((error) => {
    console.error('Error updating data:', error);
    process.exit(1);
  });
}
