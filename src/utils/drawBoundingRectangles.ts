import type { Image } from 'image-js';

import { PatternPiece } from '../PatternPiece.ts';

/**
 * Draw the bounding rectangles of the masks on the fabric.
 * @param fabric - The fabric image
 * @param pieces - The pieces to draw
 */
export function drawBoundingRectangles(
  fabric: Image,
  pieces: PatternPiece[],
): void {
  const color = new Array(fabric.channels).fill(fabric.maxValue);
  for (const piece of pieces) {
    fabric.drawRectangle({
      origin: PatternPiece.getOriginWithOrientation(piece),
      width: PatternPiece.getRotatedWidth(piece),
      height: PatternPiece.getRotatedHeight(piece),
      strokeColor: color,
      out: fabric,
    });
  }
}
