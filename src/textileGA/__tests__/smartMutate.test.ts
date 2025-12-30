import { expect, test } from 'vitest';

import { PatternPiece } from '../../patternPiece/PatternPiece.ts';
import { Gene } from '../Gene.ts';
import { Image } from 'image-js';
import { smartMutate } from '../smartMutate.ts';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

const piece = new PatternPiece(mask);

piece.centerOrigin = { row: 2, column: 3 };

const pieces = [piece];

const fabric = new Image(10, 10);

const gene = new Gene(fabric, pieces, {
  fitnessWeights: {
    averageColumn: 1,
    averageRow: 1,
    packing: 0,
    usedLength: 0,
    overlap: 0,
  },
});

test('should bring the piece top left', async () => {
  const result = smartMutate(fabric, gene, {
    nbIterations: 10,
    translationAmplitude: 1,
    debug: 1,
  });

  expect(result.patternPieces[0].centerOrigin).toStrictEqual({
    row: 1,
    column: 1,
  });
});
