import { Random } from 'ml-random';
import { describe, expect, it } from 'vitest';

import type { ConfigGA, OptionsGA } from '../GeneticAlgorithm.ts';
import { GeneticAlgorithm } from '../GeneticAlgorithm.ts';

type DataType = number[];

const randomGen = new Random(42);

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
  const mutatedGene = [...gene];
  mutatedGene[mutationPoint] += Math.round((randomGen.random() - 0.5) * 2); // small random change
  return mutatedGene;
}

function fitness(gene: DataType): number {
  // sum all elements
  return gene.reduce((acc, val) => acc + val, 0);
}

describe('GeneticAlgorithm', () => {
  it('should compute the next generation correctly', () => {
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
      scoreType: 'max' as const,
    };
    const options: OptionsGA<DataType> = {
      populationSize: 4,
      nbDiverseIndividuals: 0,
      seed: 0,
      enableCrossover: true,
      enableMutation: true,
    };
    const ga = new GeneticAlgorithm<DataType>(config, options);

    ga.computeNextGeneration(true);

    const newGen = ga.population;

    console.log('New Generation:', newGen);

    expect(newGen).toHaveLength(4);
  });
});
