import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';

import { Image } from 'image-js';
import { canPiecesFitInFabric } from '../canPiecesFitInFabric.ts';

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

test('pieces can fit', async () => {
  const fabric = new Image(10, 10);

  expect(canPiecesFitInFabric(fabric, pieces)).toBe(true);
});
test('pieces cannot fit', async () => {
  const fabric = new Image(3, 3);

  expect(canPiecesFitInFabric(fabric, pieces)).toBe(false);
});
