import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getFitness } from '../getFitness.ts';
import { Image } from 'image-js';

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

const fabric = new Image(10, 10);

test('all weights to 1', async () => {
  const fitness = getFitness(fabric, pieces, {
    weights: {
      overlap: 1,
      usedLength: 1,
      averageColumn: 1,
      averageRow: 1,
      packing: 1,
    },
  });
  const expected = {
    overlapArea: 9 / 24,
    usedLength: 1 / 2,
    averageOrigin: { column: 2 / 10, row: 1 / 10 },
    packing: 24 / 15,
    score: 9 / 24 + 1 / 2 + 2 / 10 + 1 / 10 + (1 - 24 / 15),
  };

  expect(fitness).toStrictEqual(expected);
});

test('default weights', async () => {
  const score = getFitness(fabric, pieces).score;
  const expected = 9 / 24 + 2 + 1;

  expect(score).toStrictEqual(expected);
});
