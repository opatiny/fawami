import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { getDefaultLocations } from '../getDefaultLocations.ts';

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

const mask3 = testUtils.createMask([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
]);

const masks = [mask1, mask2, mask3];

const pieces: PatternPiece[] = [];

for (const mask of masks) {
  const piece = new PatternPiece(mask);
  pieces.push(piece);
}

pieces[0].origin = { row: 1, column: 1 };
pieces[0].orientation = 90;

test('get default locations', async () => {
  const result = getDefaultLocations(pieces);

  const expected = [
    { origin: { row: 1, column: 1 }, orientation: 90 },
    { origin: { row: 0, column: 0 }, orientation: 0 },
    { origin: { row: 0, column: 0 }, orientation: 0 },
  ];

  expect(result).toStrictEqual(expected);
});
