import { Gene } from '../Gene.ts';

import { getGeneBoundingRectangle } from './getGeneBoundingRectangle.ts';

/**
 * Packing of the gene, computed as the ratio between the area of the pieces
 * and the area of the bounding rectangle containing all pieces.
 * Caution: the packing can be > 1 if pieces overlap
 *
 * @param gene - The gene to compute the packing for
 * @returns The packing ratio
 */
export function computePacking(gene: Gene): number {
  const boundingRectangle = getGeneBoundingRectangle(gene);

  const areaBoundingRectangle =
    boundingRectangle.width * boundingRectangle.height;

  let piecesArea = 0;
  for (const piece of gene.patternPieces) {
    const area = piece.meta!.surface!;
    piecesArea += area;
  }

  return piecesArea / areaBoundingRectangle;
}
