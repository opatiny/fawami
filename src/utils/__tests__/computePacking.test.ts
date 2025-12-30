import { expect, test } from 'vitest';

import { PatternPiece } from '../../patternPiece/PatternPiece.ts';
import { computePacking } from '../computePacking.ts';

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
piece2.centerOrigin = { row: 1, column: 6 };

const pieces = [piece1, piece2];

test('packing of 1', async () => {
  const result = computePacking(pieces);

  expect(result).toStrictEqual(1);
});

test('packing less than 1', async () => {
  pieces[0].orientation = 90;
  const result = computePacking(pieces);

  expect(result).toStrictEqual(24 / 35);
});
