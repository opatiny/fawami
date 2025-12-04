import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getPiecesBoundingRectangle } from '../getPiecesBoundingRectangle.ts';

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

test('both pieces in top-left corner', async () => {
  const result = getPiecesBoundingRectangle(pieces);
  const expected = {
    origin: { column: 0, row: 0 },
    width: 5,
    height: 3,
  };
  expect(result).toStrictEqual(expected);
});

test('rotate piece 1', async () => {
  pieces[0].orientation = 90;
  const result = getPiecesBoundingRectangle(pieces);
  const expected = {
    origin: { column: 0, row: -1 },
    width: 4,
    height: 5,
  };
  expect(result).toStrictEqual(expected);
});
