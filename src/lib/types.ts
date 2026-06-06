export type YearValue = {
  year: number;
  value: number;
};

export type AnnualDataset = {
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  units: string;
  data: YearValue[];
};
