import { EUR_TO_ESP, GOLD_COIN_FINE_GOLD_GRAMS } from './constants';

export function goldGramsToCoins(goldGrams: number): number {
  return goldGrams / GOLD_COIN_FINE_GOLD_GRAMS;
}

export function calculateInflationAdjustedSalary(
  currentSalary: number,
  currentYearCpi: number,
  targetYearCpi: number,
): number {
  assertPositiveFinite(currentYearCpi, 'currentYearCpi');
  assertPositiveFinite(targetYearCpi, 'targetYearCpi');
  return (currentSalary * targetYearCpi) / currentYearCpi;
}

export function calculateCpiAdjustedSalary(
  salary: number,
  sourceYearCpi: number,
  targetYearCpi: number,
): number {
  assertPositiveFinite(sourceYearCpi, 'sourceYearCpi');
  assertPositiveFinite(targetYearCpi, 'targetYearCpi');
  return (salary * targetYearCpi) / sourceYearCpi;
}

export type SalaryGoldComparisonInput = {
  pastSalaryEur: number;
  currentSalaryEur: number;
  pastYearCpi: number;
  currentYearCpi: number;
  pastGoldEurPerGram: number;
  currentGoldEurPerGram: number;
};

export type SalaryGoldComparison = {
  pastGoldCoins: number;
  inflationAdjustedSalaryEur: number;
  inflationAdjustedGoldCoinsAtCurrentPrice: number;
  currentGoldCoins: number;
};

export function calculateSalaryGoldComparison({
  pastSalaryEur,
  currentSalaryEur,
  pastYearCpi,
  currentYearCpi,
  pastGoldEurPerGram,
  currentGoldEurPerGram,
}: SalaryGoldComparisonInput): SalaryGoldComparison {
  const pastGoldCoins = calculateGoldCoins(pastSalaryEur, pastGoldEurPerGram);
  const inflationAdjustedSalaryEur = calculateCpiAdjustedSalary(
    pastSalaryEur,
    pastYearCpi,
    currentYearCpi,
  );
  const inflationAdjustedGoldCoinsAtCurrentPrice = calculateGoldCoins(
    inflationAdjustedSalaryEur,
    currentGoldEurPerGram,
  );
  const currentGoldCoins = calculateGoldCoins(
    currentSalaryEur,
    currentGoldEurPerGram,
  );

  return {
    pastGoldCoins,
    inflationAdjustedSalaryEur,
    inflationAdjustedGoldCoinsAtCurrentPrice,
    currentGoldCoins,
  };
}

export function calculateGoldGrams(
  salaryEur: number,
  goldEurPerGram: number,
): number {
  assertPositiveFinite(goldEurPerGram, 'goldEurPerGram');
  return salaryEur / goldEurPerGram;
}

export function calculateGoldCoins(
  salaryEur: number,
  goldEurPerGram: number,
): number {
  const goldGrams = calculateGoldGrams(salaryEur, goldEurPerGram);
  return goldGramsToCoins(goldGrams);
}

export function convertEurToEsp(eurAmount: number): number {
  return eurAmount * EUR_TO_ESP;
}

export function convertEspToEur(espAmount: number): number {
  return espAmount / EUR_TO_ESP;
}

function assertPositiveFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number`);
  }
}
