import { expect, test } from 'vitest';

import { PatternPiece } from '../../patternPiece/PatternPiece.ts';
import { getFitness } from '../getFitness.ts';
import { Image } from 'image-js';
import { Matrix } from 'ml-matrix';

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

// both images are in top-left corner of fabric
piece1.centerOrigin = { row: 1, column: 2 };
piece2.centerOrigin = { row: 1, column: 1 };

const pieces = [piece1, piece2];

const fabric = new Image(10, 10);

test('all weights to 1', async () => {
  const overlapMatrix = new Matrix([
    [0, -1],
    [-1, 0],
  ]);
  const fitness = getFitness(fabric, pieces, overlapMatrix, {
    weights: {
      overlap: 1,
      usedLength: 1,
      averageColumn: 1,
      averageRow: 1,
      packing: 1,
    },
  });

  expect(overlapMatrix).toStrictEqual(
    new Matrix([
      [0, 9],
      [9, 0],
    ]),
  );
  const expected = {
    overlapArea: 9 / 100,
    usedLength: 1 / 2,
    averageOrigin: { column: 1.5 / 10, row: 1 / 10 },
    packing: 24 / 15,
    score: 9 / 100 + 1 / 2 + 1.5 / 10 + 1 / 10 + (1 - 24 / 15),
  };

  expect(fitness).toStrictEqual(expected);
});
