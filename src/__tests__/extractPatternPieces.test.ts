import { expect, test } from 'vitest';

import { extractPatternPieces } from '../extractPatternPieces.ts';

test('aaron', async () => {
  const image = testUtils.load('png/aaron.png');

  const pieces = extractPatternPieces(image);

  expect(pieces).toHaveLength(6);
});

test('shapes with holes', async () => {
  const image = testUtils.load('png/shapes-holes.png');

  const pieces = extractPatternPieces(image);

  expect(pieces).toHaveLength(6);
});
