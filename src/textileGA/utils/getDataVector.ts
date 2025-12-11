import type { Gene } from '../Gene.ts';

export interface GetDataVectorOptions {
  /**
   * Normalize the coordinaates and the orientations to [0, 1] range (independently).
   * @default true
   */
  normalize?: boolean;
}

/**
 * Convert the gene data to a 1d vector.
 * @param gene - The gene to process
 * @param options  - Options
 * @returns The 1d vector of the data
 */
export function getDataVector(
  gene: Gene,
  options: GetDataVectorOptions = {},
): number[] {
  const { normalize = true } = options;

  if (normalize) {
    let maxRow = 0;
    let maxColumn = 0;
    for (const piece of gene.patternPieces) {
      if (piece.centerOrigin.row > maxRow) {
        maxRow = piece.centerOrigin.row;
      }
      if (piece.centerOrigin.column > maxColumn) {
        maxColumn = piece.centerOrigin.column;
      }
    }
    return gene.patternPieces.flatMap((piece) => [
      piece.centerOrigin.row / maxRow,
      piece.centerOrigin.column / maxColumn,
      piece.orientation / 270,
    ]);
  } else {
    return gene.patternPieces.flatMap((piece) => [
      piece.centerOrigin.row,
      piece.centerOrigin.column,
      piece.orientation,
    ]);
  }
}
