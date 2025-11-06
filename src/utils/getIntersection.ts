import { PatternPiece } from '../PatternPiece.ts';

import { getBitWithOrientation } from './getBitWithOrientation.ts';

/**
 * Compute the surface of the intersection of two pattern pieces in pixels (handles orientation).
 * @param piece1 - First pattern piece
 * @param piece2 - Second pattern piece
 * @returns Surface area of the intersection in pixels
 */
export function getIntersection(
  piece1: PatternPiece,
  piece2: PatternPiece,
): number {
  const origin1 = PatternPiece.getTopLeftOrigin(piece1);
  const origin2 = PatternPiece.getTopLeftOrigin(piece2);

  const width1 = PatternPiece.getRotatedWidth(piece1);
  const height1 = PatternPiece.getRotatedHeight(piece1);
  const width2 = PatternPiece.getRotatedWidth(piece2);
  const height2 = PatternPiece.getRotatedHeight(piece2);

  // treat easy case where bounding boxes do not intersect
  if (
    origin1.column + width1 <= origin2.column ||
    origin2.column + width2 <= origin1.column ||
    origin1.row + height1 <= origin2.row ||
    origin2.row + height2 <= origin1.row
  ) {
    return 0;
  }

  // compute intersection bounding box
  const xMin = Math.max(origin1.column, origin2.column);
  const xMax = Math.min(origin1.column + width1, origin2.column + width2);
  const yMin = Math.max(origin1.row, origin2.row);
  const yMax = Math.min(origin1.row + height1, origin2.row + height2);

  // scan intersection bounding box and count overlapping pixels
  let intersectionSurface = 0;
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const point1 = { row: y - origin1.row, column: x - origin1.column };
      const point2 = { row: y - origin2.row, column: x - origin2.column };

      const inPiece1 = getBitWithOrientation(
        piece1.mask,
        point1,
        piece1.orientation,
      );
      const inPiece2 = getBitWithOrientation(
        piece2.mask,
        point2,
        piece2.orientation,
      );
      if (inPiece1 && inPiece2) {
        intersectionSurface++;
      }
    }
  }
  return intersectionSurface;
}
