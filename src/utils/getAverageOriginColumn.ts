import type { PatternPiece, PatternPieces } from '../PatternPiece.ts';

/**
 * Compute the average column of the center origins of the given pattern pieces. Can be used to compute fitness.
 * @param patternPieces - The pattern pieces.
 * @returns The average column.
 */
export function getAverageOriginColumn(patternPieces: PatternPieces): number {
  const nbPieces = patternPieces.length;
  let totalX = 0;

  for (let i = 0; i < nbPieces; i++) {
    const piece = patternPieces[i] as PatternPiece;
    totalX += piece?.centerOrigin.column;
  }

  return totalX / nbPieces;
}
