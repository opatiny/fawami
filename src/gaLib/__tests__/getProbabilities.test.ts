import { expect, test } from 'vitest';

import { getProbabilities } from '../getProbabilities.ts';

test('default options', async () => {
  const population = [
    { score: 2, data: {} },
    { score: 4, data: {} },
    { score: 6, data: {} },
  ];

  const result = getProbabilities(population);
  const expected = [1 / 6, 1 / 3, 1 / 2];

  expect(result).toStrictEqual(expected);
});

test('default options 2', async () => {
  const population = [
    { score: 1, data: {} },
    { score: 2, data: {} },
    { score: 4, data: {} },
  ];

  const result = getProbabilities(population);
  const expected = [1 / 7, 2 / 7, 4 / 7];

  expect(result).toStrictEqual(expected);
});

test('exponent 2', async () => {
  const population = [
    { score: 1, data: {} },
    { score: 2, data: {} },
    { score: 3, data: {} },
  ];
  const result = getProbabilities(population, { exponent: 2 });
  const expected = [1 / 14, 4 / 14, 9 / 14];

  expect(result).toStrictEqual(expected);
});

test('min score type', async () => {
  const population = [
    { score: 1, data: {} },
    { score: 2, data: {} },
    { score: 4, data: {} },
  ];
  const result = getProbabilities(population, { scoreType: 'min' });
  const expected = [4 / 7, 2 / 7, 1 / 7];

  expect(result).toStrictEqual(expected);
});
