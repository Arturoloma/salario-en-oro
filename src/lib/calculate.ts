import { EUR_TO_ESP, GOLD_COIN_FINE_GOLD_GRAMS } from './constants';

export type PastSalaryMode = 'literal' | 'modern';

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

export function cpiRatio(sourceYearCpi: number, targetYearCpi: number): number {
  assertPositiveFinite(sourceYearCpi, 'sourceYearCpi');
  assertPositiveFinite(targetYearCpi, 'targetYearCpi');
  return targetYearCpi / sourceYearCpi;
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
  pastSalaryEur: number;
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
    pastSalaryEur,
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

export type LiteralPastSalaryInput = {
  literalAmount: number;
  literalCurrency: 'ESP' | 'EUR';
  sourceYearCpi: number;
  currentYearCpi: number;
  sourceYearGoldEurPerGram: number;
};

export function calculateLiteralPastModernEur({
  literalAmount,
  literalCurrency,
  sourceYearCpi,
  currentYearCpi,
}: Omit<LiteralPastSalaryInput, 'sourceYearGoldEurPerGram'>): number {
  const literalEur =
    literalCurrency === 'ESP' ? convertEspToEur(literalAmount) : literalAmount;
  return calculateCpiAdjustedSalary(literalEur, sourceYearCpi, currentYearCpi);
}

export function calculatePastGoldCoinsFromLiteral({
  literalAmount,
  literalCurrency,
  sourceYearGoldEurPerGram,
}: LiteralPastSalaryInput): number {
  const sourceYearEur =
    literalCurrency === 'ESP' ? convertEspToEur(literalAmount) : literalAmount;
  return calculateGoldCoins(sourceYearEur, sourceYearGoldEurPerGram);
}

export function goldCoinRatio(
  currentCoins: number,
  referenceCoins: number,
): number | null {
  if (!Number.isFinite(referenceCoins) || referenceCoins === 0) {
    return null;
  }
  return (currentCoins - referenceCoins) / referenceCoins;
}

function assertPositiveFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number`);
  }
}
