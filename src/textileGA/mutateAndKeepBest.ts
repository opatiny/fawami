import type { Image } from 'image-js';

import type { Gene } from './Gene.ts';
import {
  mutateTranslate,
  type MutateTranslateOptions,
} from './mutateTranslate.ts';
import { sortGenesByScore } from './utils/sortGenesByScore.ts';
import { Random } from 'ml-random';

export interface MutateAndKeepBestOptions extends MutateTranslateOptions {
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
   * Random number generator to use for mutations.
   * @default New random generator without seed
   */
  randomGen?: Random;
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
  const {
    populationSize = 10,
    nbIterations = 5,
    debug = false,
    randomGen = new Random(),
    translationAmplitude,
  } = options;
  const bestGenes: Gene[] = [];
  let bestGene = gene;

  if (debug) {
    console.log('iteration', 'score');
  }

  for (let iteration = 0; iteration < nbIterations; iteration++) {
    const mutants: Gene[] = [bestGene];
    for (let i = 0; i < populationSize; i++) {
      const mutant = mutateTranslate(fabric, bestGene, {
        randomGen,
        translationAmplitude,
      });
      mutants.push(mutant);
    }
    sortGenesByScore(mutants);

    bestGene = mutants[0];
    bestGenes.push(bestGene);

    if (debug) {
      console.log(iteration, bestGene.getFitness());
    }
  }

  return bestGenes;
}

function printScores(genes: Gene[]) {
  console.log('index', 'score');
  for (const [index, gene] of genes.entries()) {
    console.log(index, gene.getFitness());
  }
}
