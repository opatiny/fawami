import type { PatternPiece } from '../PatternPiece.ts';
import { Gene } from '../textileGA/Gene.ts';

import { getPiecesBoundingRectangle } from './getPiecesBoundingRectangle.ts';

/**
 * Packing of the gene, computed as the ratio between the area of the pieces
 * and the area of the bounding rectangle containing all pieces.
 * Caution: the packing can be > 1 if pieces overlap
 *
 * @param pieces - The pattern pieces
 * @returns The packing ratio
 */
export function computePacking(pieces: PatternPiece[]): number {
  const boundingRectangle = getPiecesBoundingRectangle(pieces);

  const areaBoundingRectangle =
    boundingRectangle.width * boundingRectangle.height;

  let piecesArea = 0;
  for (const piece of pieces) {
    const area = piece.meta!.surface!;
    piecesArea += area;
  }

  return piecesArea / areaBoundingRectangle;
}
