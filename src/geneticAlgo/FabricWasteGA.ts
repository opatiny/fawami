import type { FitnessWeights } from './getFitness.ts';

// this should be completely generic in order to be used in other projects

export interface ConfigGA<Type> {
  intitialPopulation?: Type[];

  enableCrossover?: boolean;

  enableMutation?: boolean;

  crossoverFunction?: (
    parent1: Type,
    parent2: Type,
    parameters: ParametersGA,
  ) => [Type, Type];

  mutationFunction?: (gene: Type, parameters: ParametersGA) => Type;

  fitnessFunction?: (gene: Type, parameters: ParametersGA) => number;
}

export interface ParametersGA {
  /**
   * Weights for fitness calculation
   * @default DefaultFitnessWeights
   */
  fitnessWeights?: FitnessWeights;
  /**
   * Mutation options
   */
  mutateOptions?: { translateAmplitude: number };
}
