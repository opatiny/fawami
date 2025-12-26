import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getUsedLength } from '../getUsedLength.ts';

const mask1 = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

const mask2 = testUtils.createMask([
  [1, 1],
  [1, 0],
  [1, 0],
]);

const piece1 = new PatternPiece(mask1);
const piece2 = new PatternPiece(mask2);

const pieces = [piece1, piece2];

test('both center origins (0,0)', async () => {
  const result = getUsedLength(pieces);

  expect(result).toBe(2);
});

test('move piece 2 to (1,1)', async () => {
  piece1.centerOrigin = { row: 0, column: 0 };
  piece2.centerOrigin = { row: 1, column: 1 };
  const result = getUsedLength(pieces);

  expect(result).toBe(3);
});

test('rotate piece 2 180 degrees', async () => {
  piece1.centerOrigin = { row: 0, column: 0 };
  piece2.centerOrigin = { row: 10, column: 1 };
  piece2.orientation = 180;
  const result = getUsedLength(pieces);

  expect(result).toBe(2);
});
