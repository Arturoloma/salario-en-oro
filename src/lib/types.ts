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
