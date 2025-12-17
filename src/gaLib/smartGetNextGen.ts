import type { GeneticAlgorithm, ScoredIndividual } from './GeneticAlgorithm.ts';
import { getMinDistanceToElite } from './utils/getMinDistanceToElite.ts';

export function smartGetNextGen<Type>(ga: GeneticAlgorithm<Type>): void {
  for (let i = 0; i < ga.options.eliteSize; i++) {
    const eliteGene = ga.elitePopulation[i];
    const diverseGeneIndex = ga.randomGen.randInt(ga.nbDiverseIndividuals);
    const diverseGene = ga.diversePopulation[diverseGeneIndex];

    const children = ga.crossover(eliteGene.data, diverseGene.data);

    const mutatedChildren = children.map((child) => ga.mutate(child));
  }
}

function addToPopulation<Type>(
  ga: GeneticAlgorithm<Type>,
  newIndividual: ScoredIndividual<Type>,
): void {
  const worstEliteIndex = findWorstEliteIndex(ga);

  if (newIndividual.score < ga.elitePopulation[worstEliteIndex].score) {
    // add new individual to elite
    ga.elitePopulation[worstEliteIndex] = newIndividual;
    // update distances to elite
  } else {
    const minDistance = getMinDistanceToElite(ga, newIndividual);
    let index = 0;
    let diverseSmallestMinDistance = Infinity;
    for (let i = 0; i < ga.diversePopulation.length; i++) {
      const distance = ga.minDistancesToElite[i];
      if (distance < diverseSmallestMinDistance) {
        diverseSmallestMinDistance = distance;
        index = i;
      }
    }
    if (minDistance > diverseSmallestMinDistance) {
      ga.diversePopulation[index] = newIndividual;
      ga.minDistancesToElite[index] = minDistance;
    }
  }
}

/**
 * Find elite individual with lowest score
 * @param ga - Genetic algorithm instance
 * @returns Index of the worst elite individual
 */
export function findWorstEliteIndex<Type>(ga: GeneticAlgorithm<Type>): number {
  let worstIndex = 0;
  let worstScore = Infinity;
  for (let i = 0; i < ga.options.eliteSize; i++) {
    const individual = ga.elitePopulation[i];
    if (individual.score < worstScore) {
      worstScore = individual.score;
      worstIndex = i;
    }
  }
  return worstIndex;
}

/**
 * Update the minimum distances to elite after adding a new elite individual.
 * @param ga - Genetic algorithm instance
 * @param newElite - New elite individual
 */
export function updateMinDistances<Type>(
  ga: GeneticAlgorithm<Type>,
  newElite: ScoredIndividual<Type>,
): void {
  for (let i = 0; i < ga.diversePopulation.length; i++) {
    const distance = ga.options.getDistance(ga.diversePopulation[i], newElite);
    if (distance < ga.minDistancesToElite[i]) {
      ga.minDistancesToElite[i] = distance;
    }
  }
}
