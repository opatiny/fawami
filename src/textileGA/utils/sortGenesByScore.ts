import type { Gene } from '../Gene.ts';

/**
 * Sort the given population by ascending score. A lower score is better.
 * @param genes - The genes to sort.
 */
export function sortGenesByScore(genes: Gene[]): void {
  genes.sort((a, b) => a.getFitness() - b.getFitness());
}
