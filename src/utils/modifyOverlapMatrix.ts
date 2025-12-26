import { Matrix } from 'ml-matrix';

/**
 * Set row and column of the pattern piece to -1 to indicated that overlap needs to be recomputed.
 * @param matrix - The overlap matrix to update
 * @param index - Index of the pattern piece that has been modified
 * @returns The intersection matrix
 */
export function modifyOverlapMatrix(matrix: Matrix, index: number): void {
  const nbPieces = matrix.rows;
  for (let j = 0; j < nbPieces; j++) {
    if (j !== index) {
      matrix.set(index, j, -1);
      matrix.set(j, index, -1);
    }
  }
}
