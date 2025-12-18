import { Random } from 'ml-random';
import { expect, test } from 'vitest';

import type { ConfigGA, OptionsGA } from '../GeneticAlgorithm.ts';
import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';
import { findWorstEliteIndex, updateMinDistances } from '../smartGetNextGen.ts';

type DataType = number[];

const randomGen = new Random(0);

const debug = false;

function crossover(parent1: DataType, parent2: DataType): [DataType, DataType] {
  return [parent1, parent2];
}

function mutate(gene: DataType): DataType {
  return gene;
}

function fitness(gene: DataType): number {
  return gene.reduce((acc, val) => acc + val, 0);
}

const initialPopulation: DataType[] = [
  [0, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
];

const config: ConfigGA<DataType> = {
  intitialPopulation: initialPopulation,
  crossoverFunction: crossover,
  mutationFunction: mutate,
  fitnessFunction: fitness,
};

const options: OptionsGA<DataType> = {
  populationSize: 3,
  eliteSize: 1,
  randomGen: randomGen,
  enableCrossover: true,
  enableMutation: true,
};

const ga = new GeneticAlgorithm<DataType>(config, options);

test('worst index should be 2', () => {
  const index = findWorstEliteIndex(ga);
  expect(ga.minDistancesToElite).toStrictEqual([1, 2]);

  const newElite = { data: [1, 1, 1], score: 3 };
  updateMinDistances(ga, newElite);
  const expected = [1, 0];
  expect(ga.minDistancesToElite).toStrictEqual(expected);
});
