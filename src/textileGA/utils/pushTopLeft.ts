import { getPiecesBoundingRectangle } from '../../utils/getPiecesBoundingRectangle.ts';
import { Gene } from '../Gene.ts';

/**
 * Move all the pieces as a block as close as possible to the top-left corner (0,0).
 * @param gene - The gene to modify
 * @returns New gene with pieces pushed to top-left
 */
export function pushTopLeft(gene: Gene): Gene {
  const boundingRect = getPiecesBoundingRectangle(gene.patternPieces);
  const newGene = Gene.clone(gene);
  for (const piece of newGene.patternPieces) {
    piece.centerOrigin = {
      column: piece.centerOrigin.column - boundingRect.origin.column,
      row: piece.centerOrigin.row - boundingRect.origin.row,
    };
  }
  return newGene;
}
