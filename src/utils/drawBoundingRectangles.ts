import type { Image, Mask } from 'image-js';

/**
 * Draw the bounding rectangles of the masks on the fabric.
 * @param fabric - The fabric image
 * @param masks - The masks to draw
 */
export function drawBoundingRectangles(fabric: Image, masks: Mask[]): void {
  const color = new Array(fabric.channels).fill(fabric.maxValue);
  for (const mask of masks) {
    fabric.drawRectangle({
      origin: mask.origin,
      width: mask.width,
      height: mask.height,
      strokeColor: color,
      out: fabric,
    });
  }
}
