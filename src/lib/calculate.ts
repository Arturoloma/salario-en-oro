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
