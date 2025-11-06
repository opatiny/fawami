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
  piece1.centerOrigin = { row: 0, column: 0 };
  piece2.centerOrigin = { row: 1, column: 1 };
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(3);
});

test('move piece 1 to (1,1)', async () => {
  piece1.centerOrigin = { row: 1, column: 1 };
  piece2.centerOrigin = { row: 0, column: 0 };
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(0);
});

test('bounding rectangles do not overlap', async () => {
  piece1.centerOrigin = { row: 3, column: 3 };
  piece2.centerOrigin = { row: 0, column: 0 };
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(0);
});

test('piece 2 orientation = 90', async () => {
  piece1.centerOrigin = { row: 1, column: 1 };
  piece2.centerOrigin = { row: 0, column: 0 };
  piece2.orientation = 90;
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(2);
});

test('piece 2 orientation = 180', async () => {
  piece1.centerOrigin = { row: 1, column: 1 };
  piece2.centerOrigin = { row: 1, column: 1 };
  piece2.orientation = 180;
  const result = getIntersection(piece1, piece2);

  expect(result).toBe(5);
});
