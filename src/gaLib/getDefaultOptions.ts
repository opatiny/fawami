import { Random } from 'ml-random';

import type {
  InternalOptionsGA,
  ScoredIndividual,
} from './GeneticAlgorithm.ts';

/**
 * Function computing the default options for the genetic algorithm
 * @param seed - Seed for random number generator
 * @returns The default options
 */
export function getDefaultOptions<Type>(seed: number): InternalOptionsGA<Type> {
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

function getDefaultDistantIndividualsFunction<Type>(seed: number) {
  return function randomDistantIndividuals(
    population: Array<ScoredIndividual<Type>>,
    nbIndividuals: number,
  ): Array<ScoredIndividual<Type>> {
    const randomGen = new Random(seed);
    return randomGen.choice(population, {
      size: nbIndividuals,
      replace: false,
    });
  };
}
