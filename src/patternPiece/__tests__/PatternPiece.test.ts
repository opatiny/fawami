import { expect, test } from 'vitest';

import { PatternPiece } from '../PatternPiece.ts';
import { fromMask } from 'image-js';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
]);

// get the ROIs
const rois = fromMask(mask, {}).getRois()[0];

const piece = new PatternPiece(mask);

test('no scaling', async () => {
  const inputResolution = 10;
  const desiredResolution = 10;
  const scaledPiece = PatternPiece.createFromRoi(rois, {
    inputResolution,
    desiredResolution,
  });

  expect(piece.mask).toMatchMask(mask);
});

test('scale = 2', async () => {
  const inputResolution = 10;
  const desiredResolution = 20;
  const scaledPiece = PatternPiece.createFromRoi(rois, {
    inputResolution,
    desiredResolution,
  });

  expect(scaledPiece.mask.height).toBe(8);
  expect(scaledPiece.mask.width).toBe(6);
  expect(scaledPiece.meta.resolution).toBe(20);
});

test('scale = 1/2', async () => {
  const inputResolution = 10;
  const desiredResolution = 5;
  const scaledPiece = PatternPiece.createFromRoi(rois, {
    inputResolution,
    desiredResolution,
  });

  expect(scaledPiece.mask.height).toBe(2);
  expect(scaledPiece.mask.width).toBe(2);
  expect(scaledPiece.meta.resolution).toBe(5);
});
