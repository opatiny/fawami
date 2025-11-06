import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
]);
const piece = new PatternPiece(mask);

test('getRotatedMask: orientation 0', async () => {
  const result = PatternPiece.getRotatedMask(piece);

  expect(result).toMatchMask(mask);
});

test('getRotatedMask: orientation 90', async () => {
  piece.orientation = 90;
  const result = PatternPiece.getRotatedMask(piece);

  const expectedMask = testUtils.createMask([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ]);

  expect(result).toMatchMask(expectedMask);
});
