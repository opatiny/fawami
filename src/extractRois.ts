import { join } from 'node:path';

import type { Image, Mask } from 'image-js';
import { fromMask, writeSync } from 'image-js';

/**
 * Extract the ROIs from the image.
 * @param image - The input image
 * @param debug - Whether to enable debug mode
 * @returns The masks of ROIs
 */
export function extractRois(image: Image, debug = false): Mask[] {
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

  // get the masks of the ROIs
  const masks: Mask[] = rois.map((roi) => roi.getMask());
  return masks;
}
