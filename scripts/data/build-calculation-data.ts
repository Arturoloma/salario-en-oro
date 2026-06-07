import { EUR_TO_ESP, TROY_OUNCE_GRAMS } from '../../src/lib/constants.js';
import {
  type AnnualDataset,
  type CalculationData,
  type CalculationDataRow,
} from './types.js';

export function buildCalculationData(
  cpiData: AnnualDataset,
  goldData: AnnualDataset,
  eurUsdData: AnnualDataset,
  espUsdData: AnnualDataset,
  retrievedAt: string,
): CalculationData {
  const cpiMap = new Map(cpiData.data.map((d) => [d.year, d.value]));
  const goldMap = new Map(goldData.data.map((d) => [d.year, d.value]));
  const eurUsdMap = new Map(eurUsdData.data.map((d) => [d.year, d.value]));
  const espUsdMap = new Map(espUsdData.data.map((d) => [d.year, d.value]));

  const allYears = new Set<number>([
    ...cpiData.data.map((d) => d.year),
    ...goldData.data.map((d) => d.year),
  ]);

  const sortedYears = Array.from(allYears).sort((a, b) => a - b);

  if (sortedYears.length === 0) {
    throw new Error('No years found in datasets');
  }

  const data: CalculationDataRow[] = [];

  for (const year of sortedYears) {
    const cpiIndex = cpiMap.get(year);
    const goldUsdPerTroyOunce = goldMap.get(year);

    if (cpiIndex === undefined || goldUsdPerTroyOunce === undefined) {
      continue;
    }

    const eurUsdRate = eurUsdMap.get(year) ?? null;
    const espUsdRate = espUsdMap.get(year) ?? null;

    let goldEurPerGram: number;

    if (eurUsdRate !== null && eurUsdRate > 0) {
      const eurPerTroyOunce = goldUsdPerTroyOunce / eurUsdRate;
      goldEurPerGram = eurPerTroyOunce / TROY_OUNCE_GRAMS;
    } else if (espUsdRate !== null && espUsdRate > 0) {
      const espPerTroyOunce = goldUsdPerTroyOunce * espUsdRate;
      const eurPerTroyOunce = espPerTroyOunce / EUR_TO_ESP;
      goldEurPerGram = eurPerTroyOunce / TROY_OUNCE_GRAMS;
    } else {
      continue;
    }

    data.push({
      year,
      cpiIndex,
      goldUsdPerTroyOunce,
      eurUsdRate,
      espUsdRate,
      goldEurPerGram,
    });
  }

  if (data.length === 0) {
    throw new Error('No calculation data could be generated');
  }

  data.sort((a, b) => a.year - b.year);

  return {
    retrievedAt,
    startYear: data[0].year,
    latestCompleteYear: data[data.length - 1].year,
    units: {
      cpiIndex: cpiData.units,
      goldUsdPerTroyOunce: goldData.units,
      eurUsdRate: eurUsdData.units,
      espUsdRate: espUsdData.units,
      goldEurPerGram: 'EUR per gram',
    },
    sourceIds: [cpiData.id, goldData.id, eurUsdData.id, espUsdData.id],
    data,
  };
}
