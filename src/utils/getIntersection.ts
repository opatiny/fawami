import type { PatternPiece } from '../PatternPiece.ts';
import type { PieceLocation } from '../PiecesLocations.ts';

/**
 * Compute the surface of the intersection of two pattern pieces in pixels.
 * @param piece1 - First pattern piece
 * @param piece2 - Second pattern piece
 * @param location1
 * @param location2
 * @returns Surface area of the intersection in pixels
 */
export function getIntersection(
  piece1: PatternPiece,
  piece2: PatternPiece,
  location1: PieceLocation,
  location2: PieceLocation,
): number {
  const origin1 = location1.origin;
  const origin2 = location2.origin;
  // treat easy case where bounding boxes do not intersect
  if (
    piece1.numberHoles === 0 &&
    piece2.numberHoles === 0 &&
    (origin1.column + piece1.width <= origin2.column ||
      origin2.column + piece2.width <= origin1.column ||
      origin1.row + piece1.height <= origin2.row ||
      origin2.row + piece2.height <= origin1.row)
  ) {
    return 0;
  }
  // compute intersection bounding box
  const xMin = Math.max(origin1.column, origin2.column);
  const xMax = Math.min(
    origin1.column + piece1.width,
    origin2.column + piece2.width,
  );
  const yMin = Math.max(origin1.row, origin2.row);
  const yMax = Math.min(
    origin1.row + piece1.height,
    origin2.row + piece2.height,
  );

  // scan intersection bounding box and count overlapping pixels
  let intersectionSurface = 0;
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const inPiece1 = piece1.mask.getBit(x - origin1.column, y - origin1.row);
      const inPiece2 = piece2.mask.getBit(x - origin2.column, y - origin2.row);
      if (inPiece1 && inPiece2) {
        intersectionSurface++;
      }
    }
  }
  return intersectionSurface;
}
