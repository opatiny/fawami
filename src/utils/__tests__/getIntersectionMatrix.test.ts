import { Matrix } from 'ml-matrix';
import { expect, test } from 'vitest';

import { PatternPiece } from '../../patternPiece/PatternPiece.ts';
import { getIntersectionMatrix } from '../getIntersectionMatrix.ts';

const mask1 = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

const mask2 = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
]);

const mask3 = testUtils.createMask([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
]);

const masks = [mask1, mask2, mask3];

const pieces: PatternPiece[] = [];

for (const mask of masks) {
  const piece = new PatternPiece(mask);
  pieces.push(piece);
}

test('all origins (0,0)', async () => {
  const result = getIntersectionMatrix(pieces);

  const expected = new Matrix([
    [0, 5, 1],
    [5, 0, 0],
    [1, 0, 0],
  ]);

  expect(result).toStrictEqual(expected);
});
