import type { PatternPiece } from '../PatternPiece.ts';

export function getIntersection(
  piece1: PatternPiece,
  piece2: PatternPiece,
): number {
  // treat easy case where bounding boxes do not intersect
  if (
    piece1.origin.column + piece1.width <= piece2.origin.column ||
    piece2.origin.column + piece2.width <= piece1.origin.column ||
    piece1.origin.row + piece1.height <= piece2.origin.row ||
    piece2.origin.row + piece2.height <= piece1.origin.row
  ) {
    return 0;
  }
  // compute intersection bounding box
  const xMin = Math.max(piece1.origin.column, piece2.origin.column);
  const xMax = Math.min(
    piece1.origin.column + piece1.width,
    piece2.origin.column + piece2.width,
  );
  const yMin = Math.max(piece1.origin.row, piece2.origin.row);
  const yMax = Math.min(
    piece1.origin.row + piece1.height,
    piece2.origin.row + piece2.height,
  );

  // scan intersection bounding box and count overlapping pixels
  let intersectionSurface = 0;
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const inPiece1 = piece1.mask.getBit(
        x - piece1.origin.column,
        y - piece1.origin.row,
      );
      const inPiece2 = piece2.mask.getBit(
        x - piece2.origin.column,
        y - piece2.origin.row,
      );
      if (inPiece1 && inPiece2) {
        intersectionSurface++;
      }
    }
  }
  return intersectionSurface;
}
