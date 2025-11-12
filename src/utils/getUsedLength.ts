import type { PatternPiece } from '../PatternPiece.ts';

/**
 * Compute the length of fabric used by the pieces.
 * @param pieces - Array of pattern pieces
 * @returns The length of fabric used in pixels
 */
export function getUsedLength(pieces: PatternPiece[]): number {
  let maxColumn = 0;
  for (const piece of pieces) {
    const topLeftOrigin = piece.getTopLeftOrigin();
    const rotatedWidth = piece.getRotatedWidth();
    const pieceRight = topLeftOrigin.column + rotatedWidth;
    if (pieceRight > maxColumn) {
      maxColumn = pieceRight;
    }
  }
  return maxColumn;
}
