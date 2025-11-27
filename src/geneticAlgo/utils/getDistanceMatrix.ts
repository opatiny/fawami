import { Matrix } from 'ml-matrix';

import type { Gene } from './Gene.ts';
import { getGenesDistance } from './getGenesDistance.ts';

/**
 * Compute a distance matrix between all genes in the population.
 * @param genes - Array of genes
 * @returns Distance matrix
 */
export function getDistanceMatrix(genes: Gene[]): Matrix {
  const n = genes.length;
  const matrix = Matrix.zeros(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const intersection = getGenesDistance(genes[i], genes[j]);
      matrix.set(i, j, intersection);
      matrix.set(j, i, intersection);
    }
  }

  return matrix;
}
