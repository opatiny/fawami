import { expect, test } from 'vitest';

import { extractRois } from '../extractRois.ts';

test('aaron', async () => {
  const image = testUtils.load('png/aaron.png');

  const rois = extractRois(image);

  expect(rois).toHaveLength(6);
});

test('shapes with holes', async () => {
  const image = testUtils.load('png/shapes-holes.png');

  const rois = extractRois(image);

  expect(rois).toHaveLength(6);
});
