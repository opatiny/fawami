import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';

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
      origin: piece.getTopLeftOrigin(),
      width: piece.getRotatedWidth(),
      height: piece.getRotatedHeight(),
      strokeColor: color,
      out: fabric,
    });
  }
}
