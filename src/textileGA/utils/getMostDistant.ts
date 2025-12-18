import { Matrix } from 'ml-matrix';

import type { Gene } from '../Gene.ts';
import { getGenesDistance } from './getGenesDistance.ts';

/**
 * Find the most distant gene from a source gene in an array of genes.
 * @param genes - Array of genes
 * @returns Index of the most distant gene to the source
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
