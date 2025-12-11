import { Matrix } from 'ml-matrix';

import type { Gene } from '../Gene.ts';
import { getGenesDistance } from './getGenesDistance.ts';

/**
 * Compute a distance matrix between all genes in the population.
 * @param genes - Array of genes
 * @returns Index from the most distant gene to the source
 */
export function getMostDistant(source: Gene, genes: Gene[]): number {
  const n = genes.length;
  const matrix = Matrix.zeros(n, n);

  let index = 0;
  let maxDistance = -Infinity;
  for (let i = 0; i < n; i++) {
    const distance = getGenesDistance(genes[i], source);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  return index;
}
