import { describe, expect, it } from 'vitest';

import { goldGramsToCoins } from './calculate';

describe('goldGramsToCoins', () => {
  it('converts fine gold grams to historical gold coins', () => {
    expect(goldGramsToCoins(5.81)).toBe(1);
    expect(goldGramsToCoins(11.62)).toBe(2);
  });
});
