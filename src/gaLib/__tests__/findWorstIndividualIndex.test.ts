import { Random } from 'ml-random';
import { expect, test } from 'vitest';

import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';
import { findWorstIndividualIndex } from '../smartGetNextGen.ts';

test('worst index should be 0', () => {
  const population = [
    { data: [0, 0, 1], score: 1 },
    { data: [0, 1, 1], score: 2 },
    { data: [1, 1, 1], score: 3 },
  ];

  const index = findWorstIndividualIndex(population);
  expect(index).toBe(0);
});

test('worst index should be 2', () => {
  const population = [
    { data: [1, 1, 1], score: 3 },
    { data: [0, 1, 1], score: 2 },
    { data: [0, 0, 1], score: 1 },
  ];
  const index = findWorstIndividualIndex(population);
  expect(index).toBe(2);
});
