import { Random } from 'ml-random';
import { expect, test } from 'vitest';

import type { ConfigGA, OptionsGA } from '../GeneticAlgorithm.ts';
import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';

type DataType = number[];

const randomGen = new Random(42);

const debug = false;

function crossover(parent1: DataType, parent2: DataType): [DataType, DataType] {
  const crossoverPoint = Math.floor(randomGen.random() * parent1.length);
  const child1 = parent1
    .slice(0, crossoverPoint)
    .concat(parent2.slice(crossoverPoint));
  const child2 = parent2
    .slice(0, crossoverPoint)
    .concat(parent1.slice(crossoverPoint));
  return [child1, child2];
}

function mutate(gene: DataType): DataType {
  const mutationPoint = Math.floor(randomGen.random() * gene.length);
  const mutatedGene = gene.slice();

  const mutationValue = randomGen.randInt(-1, 2);
  mutatedGene[mutationPoint] += mutationValue; // small random change
  return mutatedGene;
}

function fitness(gene: DataType): number {
  // sum all elements
  return gene.reduce((acc, val) => acc + val, 0);
}

const initialPopulation: DataType[] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
];

const config: ConfigGA<DataType> = {
  intitialPopulation: initialPopulation,
  crossoverFunction: crossover,
  mutationFunction: mutate,
  fitnessFunction: fitness,
  scoreType: 'max',
};

const options: OptionsGA<DataType> = {
  populationSize: 4,
  eliteSize: 4,
  randomGen: randomGen,
  enableCrossover: true,
  enableMutation: true,
};
const ga = new GeneticAlgorithm<DataType>(config, options);

test('should compute the next generation correctly', () => {
  ga.getNextGeneration(debug);

  expect(ga.getPopulation()).toHaveLength(4);
});

test('should evolve for multiple generations', () => {
  ga.evolve(10, debug);

  expect(ga.getPopulation()).toHaveLength(4);
  expect(ga.iteration).toBe(11);
  expect(ga.bestScoredIndividuals).toHaveLength(11);

  // expect score to be increasing at each generation
  for (let i = 1; i < ga.bestScoredIndividuals.length; i++) {
    expect(ga.bestScoredIndividuals[i].score).toBeGreaterThanOrEqual(
      ga.bestScoredIndividuals[i - 1].score,
    );
  }
});
