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
export function getDefaultOptions<Type>(
  randomGen: Random,
): InternalOptionsGA<Type> {
  const defaultOptions: InternalOptionsGA<Type> = {
    randomGen,
    enableCrossover: true,
    enableMutation: true,
    populationSize: 100,
    initialPopulationSize: 100,
    eliteSize: 5,
    getDistantIndividuals:
      getDefaultDistantIndividualsFunction<Type>(randomGen),
    getDistance: getDefaultDistanceFunction<Type>(),
    probabilityExponent: 1,
    debug: false,
  };
  return defaultOptions;
}

function getDefaultDistantIndividualsFunction<Type>(randomGen: Random) {
  return function randomDistantIndividuals(
    population: Array<ScoredIndividual<Type>>,
    nbIndividuals: number,
  ): Array<ScoredIndividual<Type>> {
    return randomGen.choice(population, {
      size: nbIndividuals,
      replace: false,
    });
  };
}

function getDefaultDistanceFunction<Type>() {
  return function getDistance(
    gene1: ScoredIndividual<Type>,
    gene2: ScoredIndividual<Type>,
  ): number {
    return Math.abs(gene1.score - gene2.score);
  };
}
