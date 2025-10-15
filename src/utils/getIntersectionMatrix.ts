import { Matrix } from 'ml-matrix';

import type { PatternPiece } from '../PatternPiece.ts';
import type { PiecesLocations } from '../PiecesLocations.ts';

import { getIntersection } from './getIntersection.ts';

/**
 * Compute the intersection of all pattern pieces in pixels and return it as a matrix.
 * The intersection of a piece with itself is considered 0.
 * @param pieces - Array of pattern pieces
 * @param locations
 * @returns The intersection matrix
 */
export function getIntersectionMatrix(
  pieces: PatternPiece[],
  locations: PiecesLocations,
): Matrix {
  if (pieces.length !== locations.length) {
    throw new Error(
      'getIntersectionMatrix: Number of pieces and number of locations must be equal',
    );
  }

  const n = pieces.length;
  const matrix = Matrix.zeros(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const piece1 = pieces[i] as PatternPiece;
      const piece2 = pieces[j] as PatternPiece;

      // todo: change this
      const location1 = locations[i];
      const location2 = locations[j];
      const intersection = getIntersection(
        piece1,
        piece2,
        location1,
        location2,
      );
      matrix.set(i, j, intersection);
      matrix.set(j, i, intersection);
    }
  }

  return matrix;
}
