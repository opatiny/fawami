import { Matrix } from 'ml-matrix';

import type {
  PatternPiece,
  PatternPieces,
} from '../patternPiece/PatternPiece.ts';

import { getIntersection } from './getIntersection.ts';

/**
 * Update the overlap matrix of a gene (in place).
 * The intersection of a piece with itself is considered 0.
 * Only entries set to -1 are updated.
 * @param matrix - The overlap matrix to update
 * @param pieces - Array of pattern pieces
 * @returns The intersection matrix
 */
export function updateOverlapMatrix(
  matrix: Matrix,
  pieces: PatternPieces,
): void {
  const n = pieces.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix.get(i, j) == -1) {
        const piece1 = pieces[i] as PatternPiece;
        const piece2 = pieces[j] as PatternPiece;

        const intersection = getIntersection(piece1, piece2);
        matrix.set(i, j, intersection);
        matrix.set(j, i, intersection);
      }
    }
  }
}
