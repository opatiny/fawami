import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getIntersection } from '../getIntersection.ts';

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

const piece1 = new PatternPiece(mask1);
const piece2 = new PatternPiece(mask2);

test('both origins (0,0)', async () => {
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(5);
});

test('move piece 2 to (1,1)', async () => {
  piece1.origin = { row: 0, column: 0 };
  piece2.origin = { row: 1, column: 1 };
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(3);
});

test('move piece 1 to (1,1)', async () => {
  piece1.origin = { row: 1, column: 1 };
  piece2.origin = { row: 0, column: 0 };
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(0);
});
