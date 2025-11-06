import type { Point } from 'image-js';

/**
 * Get the center point given width and height. Relative to top-left corner. The top-left pixel is (0,0).
 * If nb of pixels is even, take the lower index.
 * @param width - The width
 * @param height - The height
 * @returns The center point
 */
export function getCenterPoint(width: number, height: number): Point {
  return {
    row: Math.floor((height - 1) / 2),
    column: Math.floor((width - 1) / 2),
  };
}
