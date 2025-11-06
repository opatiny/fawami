import type { Image, Mask, Point } from 'image-js';

export function getBitWithOrientation(
  img: Image | Mask,
  point: Point,
  orientation: number,
): number {
  const { row, column } = point;

  let pixel;
  if (orientation === 0) {
    pixel = img.getPixel(column, row);
  } else if (orientation === 90) {
    const x = img.height - 1 - row;
    const y = column;
    pixel = img.getPixel(x, y);
  } else if (orientation === 180) {
    const x = img.width - 1 - column;
    const y = img.height - 1 - row;
    pixel = img.getPixel(x, y);
  } else if (orientation === 270) {
    const x = row;
    const y = img.width - 1 - column;
    pixel = img.getPixel(x, y);
  } else {
    throw new Error(`Unsupported orientation: ${orientation}`);
  }
  return pixel[0] as number;
}
