import type { Image } from 'image-js';

/**
 * Get the black color for the given image.
 * @param image - The image to get the black color for
 * @returns The black color
 */
export function getBlack(image: Image): number[] {
  const black = new Array(image.channels).fill(0);
  if (image.alpha) {
    black[black.length - 1] = image.maxValue;
  }
  return black;
}
