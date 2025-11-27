import { Random } from 'ml-random';

import type {
  InternalOptionsGA,
  ScoredIndividual,
} from '../../GeneticAlgorithm.ts';

/**
 * Function computing the default options for the genetic algorithm
 * @param seed - Seed for random number generator
 * @returns The default options
 */
export function getDefaultTextileGAOptions<Type>(
  seed: number,
): InternalOptionsGA<Type> {
  const defaultOptions: InternalOptionsGA<Type> = {
    enableCrossover: true,
    enableMutation: true,
    populationSize: 100,
    nbDiverseIndividuals: 10,
    getDistantIndividuals: getDefaultDistantIndividualsFunction<Type>(seed),
    probabilityExponent: 1,
    debug: false,
    seed,
  };
  return defaultOptions;
}
