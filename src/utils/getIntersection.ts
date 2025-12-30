import type { PatternPiece } from '../patternPiece/PatternPiece.ts';

import { getBitWithOrientation } from './getBitWithOrientation.ts';

export interface RawMask {
  width: number;
  height: number;
  data: Uint8Array;
}

/**
 * Compute the surface of the intersection of two pattern pieces in pixels (handles orientation).
 * @param piece1 - First pattern piece
 * @param piece2 - Second pattern piece
 * @returns Overlap of the pieces in pixels
 */
export function getIntersection(
  piece1: PatternPiece,
  piece2: PatternPiece,
  debug = false,
): number {
  const origin1 = piece1.getTopLeftOrigin();
  const origin2 = piece2.getTopLeftOrigin();
  if (debug) {
    console.log('Origin piece 1:', origin1);
    console.log('Origin piece 2:', origin2);
  }

  const width1 = piece1.getRotatedWidth();
  const height1 = piece1.getRotatedHeight();
  const width2 = piece2.getRotatedWidth();
  const height2 = piece2.getRotatedHeight();
  if (debug) {
    console.log({ width1, height1, width2, height2 });
  }

  // treat easy case where bounding boxes do not intersect
  if (
    origin1.column + width1 <= origin2.column ||
    origin2.column + width2 <= origin1.column ||
    origin1.row + height1 <= origin2.row ||
    origin2.row + height2 <= origin1.row
  ) {
    if (debug) {
      console.log('No bounding box intersection');
    }
    return 0;
  }

  // compute intersection bounding box relative to top-left corner of the fabric
  const xMin = Math.max(origin1.column, origin2.column);
  const xMax = Math.min(origin1.column + width1, origin2.column + width2);
  const yMin = Math.max(origin1.row, origin2.row);
  const yMax = Math.min(origin1.row + height1, origin2.row + height2);

  if (debug) {
    console.log('Intersection bounding box:', {
      xMin,
      xMax,
      yMin,
      yMax,
    });
  }

  const mask1 = piece1.mask.getRawImage();
  const mask2 = piece2.mask.getRawImage();

  // scan intersection bounding box and count overlapping pixels
  let intersectionSurface = 0;
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      // pixel coordinates relative to top-left corner of each rotated piece
      const point1 = { row: y - origin1.row, column: x - origin1.column };
      const point2 = { row: y - origin2.row, column: x - origin2.column };
      if (debug) {
        console.log(`Checking point (${x}, ${y}) of BR:`);
        console.log('  Point in piece 1:', point1);
        console.log('  Point in piece 2:', point2);
      }

      const inPiece1 = getBitWithOrientation(mask1, point1, piece1.orientation);
      if (!inPiece1) continue;
      const inPiece2 = getBitWithOrientation(mask2, point2, piece2.orientation);

      if (debug) {
        console.log(`  inPiece1: ${inPiece1}, inPiece2: ${inPiece2}`);
      }
      if (inPiece2) {
        intersectionSurface++;
      }
    }
  }
  return intersectionSurface;
}
