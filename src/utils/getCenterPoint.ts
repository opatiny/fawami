import type { Point } from 'image-js';

/**
 * Get the center point given width and height.
 * @param width - The width
 * @param height - The height
 * @returns The center point
 */
export function getCenterPoint(width: number, height: number): Point {
  return {
    row: Math.floor(height / 2),
    column: Math.floor(width / 2),
  };
}
