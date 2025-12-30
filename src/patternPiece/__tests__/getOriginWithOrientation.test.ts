import { expect, test } from 'vitest';

import { PatternPiece } from '../PatternPiece.ts';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
]);
const piece = new PatternPiece(mask);

test('orientation 0', async () => {
  piece.orientation = 0;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = piece.getTopLeftOrigin();

  const expectedOrigin = { row: -1, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});

test('orientation 90', async () => {
  piece.orientation = 90;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = piece.getTopLeftOrigin();

  const expectedOrigin = { row: -1, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});

test('orientation 180', async () => {
  piece.orientation = 180;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = piece.getTopLeftOrigin();

  const expectedOrigin = { row: -2, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});

test('orientation 270', async () => {
  piece.orientation = 270;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = piece.getTopLeftOrigin();

  const expectedOrigin = { row: -1, column: -2 };

  expect(result).toStrictEqual(expectedOrigin);
});
