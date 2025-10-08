import { join } from 'node:path';

import type { Image, Roi } from 'image-js';
import { fromMask, writeSync } from 'image-js';

import { PatternPiece } from './PatternPiece.ts';

/**
 * Extract the ROIs from the image.
 * @param image - The input image
 * @param debug - Whether to enable debug mode
 * @returns The masks of ROIs
 */
export function extractPatternPieces(
  image: Image,
  debug = false,
): PatternPiece[] {
  if (debug) {
    // check color model
    console.log(`extractRois: Color model: ${image.colorModel}`);
  }

  if (debug) {
    writeSync(join(import.meta.dirname, 'extractRois-original.png'), image);
  }

  const greyImage = image.invert().grey({ mergeAlpha: true });

  if (debug) {
    writeSync(
      join(import.meta.dirname, 'extractRois-grayImage.png'),
      greyImage,
    );
  }

  const mask = greyImage.threshold();

  // get the ROIs
  const roiMap = fromMask(mask, {});

  const rois = roiMap.getRois();
  if (debug) {
    console.log(`extractRois: Found ${rois.length} ROIs`);
  }

  const pieces: PatternPiece[] = [];
  for (const roi of rois) {
    pieces.push(new PatternPiece(roi));
  }

  return pieces;
}
