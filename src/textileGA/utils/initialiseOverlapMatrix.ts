import { Matrix } from 'ml-matrix';

export function initialiseOverlapMatrix(nbPieces: number): Matrix {
  const matrix = new Matrix(nbPieces, nbPieces).fill(-1);
  for (let i = 0; i < nbPieces; i++) {
    matrix.set(i, i, 0);
  }
  return matrix;
}
