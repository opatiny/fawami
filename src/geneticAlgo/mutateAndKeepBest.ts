import type { Image } from 'image-js';

import type { Gene } from './Gene.ts';
import { mutateTranslate } from './mutateTranslate.ts';
import { sortGenesByScore } from './sortGenesByScore.ts';

export interface MutateAndKeepBestOptions {
  /**
   * Population size of mutants to generate at each iteration.
   * @default 10
   */
  populationSize?: number;
  /**
   * Number of iterations (generations) to compute)
   * @default 5
   */
  nbIterations?: number;
  /**
   * Enable debug?
   * @default false
   */
  debug?: boolean;
}

/**
 * Mutate a gene and keep the best one of each generation.
 * @param fabric - The fabric image.
 * @param gene - The gene to mutate.
 * @param options - Options for mutation.
 * @returns The best mutated gene.
 */
export function mutateAndKeepBest(
  fabric: Image,
  gene: Gene,
  options: MutateAndKeepBestOptions = {},
): Gene[] {
  const { populationSize = 10, nbIterations = 5, debug = false } = options;
  const bestGenes: Gene[] = [];
  let bestGene = gene;
  for (let iteration = 0; iteration < nbIterations; iteration++) {
    const mutants: Gene[] = [];
    for (let i = 0; i < populationSize; i++) {
      const mutant = mutateTranslate(fabric, bestGene, { seed: i });
      mutants.push(mutant);
    }
    sortGenesByScore(mutants);

    bestGene = mutants[0];
    bestGenes.push(bestGene);

    if (debug) {
      console.log(`Iteration ${iteration + 1}:`);
      console.log('Current best score:', bestGene.fitness.score);
    }
  }
  return bestGenes;
}

function printScores(genes: Gene[]) {
  console.log('index', 'score');
  for (const [index, gene] of genes.entries()) {
    console.log(index, gene.fitness.score);
  }
}
