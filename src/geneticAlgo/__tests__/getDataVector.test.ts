import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { Gene } from '../Gene.ts';

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

piece1.orientation = 90;
piece2.orientation = 180;

const pieces = [piece1, piece2];

const gene = new Gene(pieces);

test('not normalised', async () => {
  const result = gene.getDataVector({ normalize: false });
  const expected = [
    1,
    2,
    90, // piece 1
    1,
    1,
    180, // piece 2
  ];

  expect(result).toStrictEqual(expected);
});

test('normalised', async () => {
  const result = gene.getDataVector({ normalize: true });
  const expected = [1, 1, 1 / 3, 1, 0.5, 2 / 3];

  expect(result).toStrictEqual(expected);
});
