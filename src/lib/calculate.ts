import { GOLD_COIN_FINE_GOLD_GRAMS } from './constants';

export function goldGramsToCoins(goldGrams: number): number {
  return goldGrams / GOLD_COIN_FINE_GOLD_GRAMS;
}
