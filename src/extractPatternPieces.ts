import { join } from 'node:path';

import type { Image } from 'image-js';
import { fromMask, writeSync } from 'image-js';

import type { PatternPieces } from './PatternPiece.ts';
import { PatternPiece } from './PatternPiece.ts';

export interface ExtractPatternPiecesOptions {
  /**
   * Input image resolution in pixels per cm
   * @default 10
   */
  patternResolution?: number;
  /**
   * Desired output image resolution in pixels per cm
   * @default 10
   */
  desiredResolution?: number;
  /**
   * Display debug information?
   * @default false
   */
  debug?: boolean;
}

/**
 * Extract the ROIs from the image.
 * @param image - The input image
 * @param options - Options
 * @returns The masks of ROIs
 */
export function extractPatternPieces(
  image: Image,
  options: ExtractPatternPiecesOptions = {},
): PatternPieces {
  // todo: implement resolution change
  const {
    patternResolution = 10,
    desiredResolution = 10,
    debug = false,
  } = options;

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

  const pieces: PatternPieces = [];
  for (const roi of rois) {
    pieces.push(PatternPiece.createFromRoi(roi));
  }

  return pieces;
}
