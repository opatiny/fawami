import { Image } from 'image-js';
import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { checkPiecesInFabric } from '../checkPiecesInFabric.ts';

const fabric = new Image(10, 10);

const mask1 = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);
const piece1 = new PatternPiece(mask1);

test('piece in fabric', async () => {
  const result = checkPiecesInFabric(fabric, [piece1]);

  expect(result).toBe(true);
});

test('piece out of fabric', async () => {
  piece1.origin = { row: 8, column: 8 };
  const result = checkPiecesInFabric(fabric, [piece1]);

  expect(result).toBe(false);
});
