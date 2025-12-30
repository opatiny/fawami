import { Image } from 'image-js';
import { expect, test } from 'vitest';

import { PatternPiece } from '../../patternPiece/PatternPiece.ts';

import { checkPiecesInFabric } from '../checkPiecesInFabric.ts';

const fabric = new Image(10, 10);

const mask = testUtils.createMask([
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
]);
const piece = new PatternPiece(mask);

test('piece out of fabric with (0,0) origin', async () => {
  piece.centerOrigin = { row: 0, column: 0 };
  const result = checkPiecesInFabric(fabric, [piece]);

  expect(result).toBe(false);
});

test('piece in fabric', async () => {
  piece.centerOrigin = { row: 1, column: 2 };
  const result = checkPiecesInFabric(fabric, [piece]);

  expect(result).toBe(true);
});

test('rotated piece out of fabric', async () => {
  piece.centerOrigin = { row: 1, column: 2 };
  piece.orientation = 90;
  const result = checkPiecesInFabric(fabric, [piece]);

  expect(result).toBe(false);
});
