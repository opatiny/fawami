import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getFitness } from '../getFitness.ts';

const mask1 = testUtils.createMask([
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
]);

const mask2 = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

const piece2 = new PatternPiece(mask2);
const piece1 = new PatternPiece(mask1);

piece1.centerOrigin = { row: 1, column: 2 };
piece2.centerOrigin = { row: 1, column: 1 };

const pieces = [piece1, piece2];

test('all weights to 1', async () => {
  const fitness = getFitness(pieces, {
    weights: { overlap: 1, usedLength: 1, averageColumn: 1 },
  });
  const expected = {
    overlapArea: 9,
    usedLength: 5,
    averageColumn: 1.5,
    score: 15.5,
  };

  expect(fitness).toStrictEqual(expected);
});

test('default weights', async () => {
  const fitness = getFitness(pieces);
  const expected = {
    overlapArea: 9,
    usedLength: 5,
    averageColumn: 1.5,
    score: 24, // 1*9 + 0*5 + 10*1.5 = 24
  };

  expect(fitness).toStrictEqual(expected);
});
