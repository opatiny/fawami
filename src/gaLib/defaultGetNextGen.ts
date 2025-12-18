import type { GeneticAlgorithm, ScoredIndividual } from './GeneticAlgorithm.ts';
import { getProbabilities } from './utils/getProbabilities.ts';

export function defaultGetNextGen<Type>(
  ga: GeneticAlgorithm<Type>,
  debug = false,
): void {
  const population = ga.getPopulation();
  const originalIndividuals = population.map((ind) => ind.data);

  const crossovered: Type[] = [];
  // apply crossover
  if (ga.options.enableCrossover) {
    // todo: change this to cross each elite once?
    const nbCrossovers = Math.floor(ga.options.populationSize / 2);

    if (debug) {
      console.log(`Performing ${nbCrossovers} crossovers`);
    }

    // compute probabilities for selection based on fitness scores
    const probabilities = getProbabilities(population, {
      exponent: ga.options.probabilityExponent,
    });

    const indices = population.map((_, index) => index);
    for (let i = 0; i < nbCrossovers; i++) {
      const parentsIndices = ga.randomGen.choice(indices, {
        size: 2,
        replace: false,
        // probabilities,
      });
      if (debug) {
        console.log({ parentsIndices });
      }
      const parents = [
        originalIndividuals[parentsIndices[0]],
        originalIndividuals[parentsIndices[1]],
      ];
      const [child1, child2] = ga.crossover(parents[0], parents[1]);
      crossovered.push(child1, child2);
    }
  }

  // apply mutation to original and crossovered individuals
  const mutated: Type[] = [];
  if (ga.options.enableMutation) {
    const toMutate = [...originalIndividuals, ...crossovered];
    for (const individual of toMutate) {
      const mutatedIndividual = ga.mutate(individual);
      mutated.push(mutatedIndividual);
    }
  }

  const newIndividuals = mutated;
  const newScoredIndividuals: Array<ScoredIndividual<Type>> =
    newIndividuals.map((individual) => ({
      data: individual,
      score: ga.fitness(individual),
    }));

  const newPopulation = [...population, ...newScoredIndividuals];

  // sort by descending fitness score
  ga.sortPopulationDescending(newPopulation);

  ga.elitePopulation = newPopulation.slice(0, ga.options.eliteSize);

  // select most diverse individuals if needed
  if (ga.nbDiverseIndividuals > 0) {
    // there is a probability that one of the individuals selected is already in the population
    const diverseIndividuals = ga.options.getDistantIndividuals(
      newPopulation,
      ga.nbDiverseIndividuals,
    );
    ga.diversePopulation = diverseIndividuals;
  }

  ga.iteration++;
  ga.bestScoredIndividuals.push(ga.elitePopulation[0]);
}
