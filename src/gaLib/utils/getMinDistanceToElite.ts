import type {
  GeneticAlgorithm,
  ScoredIndividual,
} from '../GeneticAlgorithm.ts';
/**
 * Compute the minimum distance from a new individual to the elite individuals.
 * @param ga - Genetic algorithm instance
 * @param newIndividual - New individual
 * @returns Minimum distance to elite individuals
 */
export function getMinDistanceToElite<Type>(
  ga: GeneticAlgorithm<Type>,
  newIndividual: ScoredIndividual<Type>,
) {
  let minDistance = Infinity;
  for (let elite of ga.elitePopulation) {
    const distance = ga.options.getDistance(newIndividual, elite);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}
