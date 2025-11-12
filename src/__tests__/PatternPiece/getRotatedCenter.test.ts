import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';

const mask = testUtils.createMask([
  [1, 1],
  [1, 0],
  [1, 0],
  [1, 0],
]);
const piece = new PatternPiece(mask);

test('orientation 0', async () => {
  piece.orientation = 0;
  const result = piece.getRelativeCenter();

  const expected = { row: 1, column: 0 };

  expect(result).toStrictEqual(expected);
});

test('orientation 90', async () => {
  piece.orientation = 90;
  const result = piece.getRelativeCenter();

  const expected = { row: 1, column: 1 };

  expect(result).toStrictEqual(expected);
});

test('orientation 180', async () => {
  piece.orientation = 180;
  const result = piece.getRelativeCenter();

  const expected = { row: 2, column: 1 };

  expect(result).toStrictEqual(expected);
});

test('orientation 270', async () => {
  piece.orientation = 270;
  const result = piece.getRelativeCenter();

  const expected = { row: 0, column: 2 };

  expect(result).toStrictEqual(expected);
});
