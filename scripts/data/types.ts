export type YearValue = {
  year: number;
  value: number;
};

export type AnnualDataset = {
  id: string;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
  units: string;
  frequency: 'annual';
  license?: string;
  licenseUrl?: string;
  termsUrl?: string;
  attribution?: string;
  data: YearValue[];
};

export type CalculationDataRow = {
  year: number;
  cpiIndex: number;
  goldUsdPerTroyOunce: number;
  eurUsdRate: number | null;
  espUsdRate: number | null;
  goldEurPerGram: number;
};

export type CalculationData = {
  retrievedAt: string;
  startYear: number;
  latestCompleteYear: number;
  units: {
    cpiIndex: string;
    goldUsdPerTroyOunce: string;
    eurUsdRate: string;
    espUsdRate: string;
    goldEurPerGram: string;
  };
  sourceIds: string[];
  data: CalculationDataRow[];
};

export type Metadata = {
  retrievedAt: string;
  startYear: number;
  latestCompleteYear: number;
  methodologyVersion: string;
  sources: {
    id: string;
    name: string;
    url: string;
    license?: string;
    licenseUrl?: string;
    termsUrl?: string;
    attribution?: string;
  }[];
};

export type GoldSourceMetadata = {
  source: string;
  sourceUrl: string;
  downloadName: string;
  license: string;
  licenseUrl: string;
  termsUrl: string;
  attribution: string;
};

export const GOLD_SOURCE_METADATA: GoldSourceMetadata = {
  source: 'World Bank Commodity Markets',
  sourceUrl: 'https://www.worldbank.org/en/research/commodity-markets',
  downloadName: 'CMO-Historical-Data-Annual.xlsx',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  termsUrl:
    'https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets',
  attribution: 'The World Bank: Commodity Markets Pink Sheet: annual prices.',
};

export const CPI_SOURCE_METADATA = {
  source: 'Instituto Nacional de Estadística',
  sourceUrl:
    'https://servicios.ine.es/wstempus/jsCache/es/DATOS_TABLA/24077?tip=AM&',
  license: 'INE data reuse terms',
  licenseUrl: 'https://www.ine.es/aviso_legal',
  attribution:
    'Instituto Nacional de Estadística: Índice de Precios de Consumo.',
};

export const EXCHANGE_RATE_SOURCE_METADATA = {
  ecb: {
    source: 'European Central Bank',
    sourceUrl: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip',
    license: 'ECB data reuse terms',
    licenseUrl:
      'https://www.ecb.europa.eu/services/disclaimer/html/index.en.html',
    attribution:
      'European Central Bank: euro foreign exchange reference rates.',
  },
  bde: {
    source: 'Banco de España',
    sourceUrl:
      'https://www.bde.es/webbe/es/estadisticas/temas/tipos-cambio.html',
    license: 'Banco de España data reuse terms',
    licenseUrl: 'https://www.bde.es/wbe/es/pie/aviso-legal/',
    attribution: 'Banco de España: historical exchange rates.',
  },
};
