import { expect, test } from 'vitest';

import { PatternPiece } from '../../../PatternPiece.ts';
import { Gene } from '../../Gene.ts';
import { Image } from 'image-js';
import { pushTopLeft } from '../pushTopLeft.ts';

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
piece2.centerOrigin = { row: 1, column: 6 };

piece1.orientation = 90;
piece2.orientation = 180;

const pieces = [piece1, piece2];

const fabric = new Image(10, 10);

const gene = new Gene(fabric, pieces);

test('pieces should be moved', async () => {
  const newGene = pushTopLeft(gene);

  const result = newGene.getImage();

  expect(result).toMatchImageSnapshot();
});
