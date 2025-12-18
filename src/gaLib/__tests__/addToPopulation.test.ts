import { Random } from 'ml-random';
import { expect, test } from 'vitest';

import type {
  ConfigGA,
  OptionsGA,
  ScoredIndividual,
} from '../GeneticAlgorithm.ts';
import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';
import {
  addToPopulation,
  findWorstEliteIndex,
  updateMinDistances,
} from '../smartGetNextGen.ts';

type DataType = number[];

const randomGen = new Random(0);

function crossover(parent1: DataType, parent2: DataType): [DataType, DataType] {
  return [parent1, parent2];
}

function mutate(gene: DataType): DataType {
  return gene;
}

// smaller sum is better
function fitness(gene: DataType): number {
  return -gene.reduce((acc, val) => acc + val, 0);
}

function getDistance(
  ind1: ScoredIndividual<DataType>,
  ind2: ScoredIndividual<DataType>,
): number {
  let distance = 0;
  for (let i = 0; i < ind1.data.length; i++) {
    if (ind1.data[i] !== ind2.data[i]) {
      distance++;
    }
  }
  return distance;
}

const initialPopulation: DataType[] = [
  [0, 0, 1, 1, 1],
  [0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
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
  getDistance: getDistance,
};

test('should add to elite', () => {
  const ga = new GeneticAlgorithm<DataType>(config, options);
  const newElite = { data: [0, 0, 0, 0, 1], score: -1 };

  addToPopulation(ga, newElite, { debug: true });

  expect(ga.elitePopulation).toContainEqual(newElite);
  expect(ga.minDistancesToElite).toStrictEqual([3, 4]);
});

test('should add to diverse', () => {
  const ga = new GeneticAlgorithm<DataType>(config, options);
  const newElite = { data: [1, 1, 1, 1, 0], score: -4 };

  addToPopulation(ga, newElite, { debug: true });

  expect(ga.minDistancesToElite).toStrictEqual([3, 2]);
});
