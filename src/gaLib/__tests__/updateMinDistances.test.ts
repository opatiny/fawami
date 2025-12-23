import { Random } from 'ml-random';
import { expect, test } from 'vitest';

import type { ConfigGA, OptionsGA } from '../GeneticAlgorithm.ts';
import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';
import {
  findWorstIndividualIndex,
  updateMinDistances,
} from '../smartGetNextGen.ts';

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
  [1, 1, 1],
  [0, 1, 1],
  [0, 0, 1],
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

test('initial minimal distances should be correct', () => {
  expect(ga.minDistancesToElite).toStrictEqual([1, 2]);
});

test('update distances', () => {
  ga.elitePopulation[0] = { data: [1, 1, 0], score: 2 };
  updateMinDistances(ga);

  const expected = [0, 1];
  expect(ga.minDistancesToElite).toStrictEqual(expected);
});
