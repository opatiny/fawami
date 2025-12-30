import type { Point } from 'image-js';

import type {
  PatternPiece,
  PatternPieces,
} from '../patternPiece/PatternPiece.ts';

/**
 * Compute the average column of the center origins of the given pattern pieces. Can be used to compute fitness.
 * @param patternPieces - The pattern pieces.
 * @returns The average column.
 */
export function getAverageOrigin(patternPieces: PatternPieces): Point {
  const nbPieces = patternPieces.length;
  let totalX = 0;
  let totalY = 0;

  for (let i = 0; i < nbPieces; i++) {
    const piece = patternPieces[i] as PatternPiece;
    totalX += piece?.centerOrigin.column;
    totalY += piece?.centerOrigin.row;
  }

  return {
    column: totalX / nbPieces,
    row: totalY / nbPieces,
  };
}
