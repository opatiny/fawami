import type { Image, Mask, Point } from 'image-js';

/**
 * Get a pixel from a rotated image.
 * @param image The image (not rotated)
 * @param point Coordinates of the point in the rotated image
 * @param orientation The desired orientation of the image
 * @returns Value of the pixel
 */
export function getBitWithOrientation(
  image: Image | Mask,
  point: Point,
  orientation: number,
): number {
  const { row, column } = point;

  let originalColumn = 0;
  let originalRow = 0;

  switch (orientation) {
    case 0:
      originalColumn = column;
      originalRow = row;
      break;
    case 90:
      originalColumn = image.width - 1 - row;
      originalRow = column;
      break;
    case 180:
      originalColumn = image.width - 1 - column;
      originalRow = image.height - 1 - row;
      break;
    case 270:
      originalColumn = row;
      originalRow = image.height - 1 - column;
      break;
    default:
      throw new Error(`Unsupported orientation: ${orientation}`);
  }

  const pixel = image.getPixel(originalColumn, originalRow);
  return pixel[0] as number;
}
