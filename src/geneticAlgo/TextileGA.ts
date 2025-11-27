import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';
import type {
  GeneticAlgorithm,
  OptionsGA,
  ScoredIndividual,
} from '../gaLib/GeneticAlgorithm.ts';

import type { Gene } from './Gene.ts';
import {
  crossover1Point,
  DefaultCrossoverOptions,
  type CrossoverOptions,
} from './crossover1Point.ts';
import { DefaultFitnessWeights, type FitnessWeights } from './getFitness.ts';
import {
  DefaultMutateOptions,
  mutateTranslate,
  type MutateOptions,
} from './mutateTranslate.ts';
import { getRandomGenes } from './getRandomGenes.ts';
import { getDefaultSeed } from '../utils/getDefaultSeed.ts';
import { getDefaultOptions } from '../gaLib/getDefaultOptions.ts';
import { getDistantGenes } from './getDistantGenes.ts';

// this should be completely generic in order to be used in other projects

export interface ConfigTextileGA {
  patternPieces: PatternPiece[];

  fabric: Image;
}

export interface OptionsTextileGA {
  /**
   * Seed used for all random values in the genetic algorithm ("top-level" seed).
   */
  seed?: number;
  /**
   * Genetic algorithm options
   */
  optionsGA?: Omit<OptionsGA<Gene>, 'seed'>;
  /**
   * Weights for fitness calculation
   * @default DefaultFitnessWeights
   */
  fitnessWeights?: FitnessWeights;
  /**
   * Mutation options
   */
  mutateOptions?: MutateOptions;
  /**
   * Crossover options
   */
  crossoverOptions?: CrossoverOptions;
}

export class TextileGA {
  public readonly patternPieces: PatternPiece[];
  public readonly fabric: Image;

  public readonly seed: number;
  public optionsGA: OptionsGA<Gene>;
  public fitnessWeights: FitnessWeights;
  public mutateOptions?: MutateOptions;
  public crossoverOptions?: CrossoverOptions;

  public readonly ga: GeneticAlgorithm<Gene>;

  public constructor(config: ConfigTextileGA, options: OptionsTextileGA = {}) {
    const {
      seed = getDefaultSeed(),
      optionsGA,
      fitnessWeights,
      mutateOptions,
      crossoverOptions,
    } = options;

    // create correct config for GA
    const gaConfig = {
      intitialPopulation: this.getInitialPopulation(),
      crossoverFunction: this.getCrossoverFunction(seed, crossoverOptions),
      mutationFunction: this.getMutationFunction(seed, mutateOptions),
      fitnessFunction: this.getFitnessFunction(),
      scoreType: 'min',
    };

    // create correct options for GA
    const defaultOptionsGA = getDefaultOptions<Gene>(seed);

    const gaOptions: OptionsGA<Gene> = {
      ...defaultOptionsGA,
      ...optionsGA,
    };

    gaOptions.seed = seed;

    // todo: improve the distance function
    gaOptions.getDistantIndividuals = (
      population: ScoredIndividual<Gene>[],
      nbIndividuals: number,
    ) => {
      const genes = population.map((individual) => individual.data);
      const distantIndividuals = getDistantGenes(genes, {
        numberOfGenes: nbIndividuals,
      });
      return distantIndividuals.map((gene) => ({
        data: gene,
        score: gene.fitness.score,
      }));
    };

    // assign values to class properties
    this.patternPieces = config.patternPieces;
    this.fabric = config.fabric;

    this.seed = seed;
    this.optionsGA = gaOptions;
    this.fitnessWeights = { ...DefaultFitnessWeights, ...fitnessWeights };
    this.mutateOptions = { ...DefaultMutateOptions, ...mutateOptions };
    this.crossoverOptions = { ...DefaultCrossoverOptions, ...crossoverOptions };
  }

  private getFitnessFunction() {
    return (gene: Gene) => {
      return gene.fitness.score;
    };
  }

  private getCrossoverFunction(seed: number, options?: CrossoverOptions) {
    return (parent1: Gene, parent2: Gene): [Gene, Gene] => {
      return crossover1Point(parent1, parent2, { seed, ...options });
    };
  }

  private getMutationFunction(seed: number, mutateOptions?: MutateOptions) {
    return (gene: Gene): Gene => {
      return mutateTranslate(this.fabric, gene, { seed, ...mutateOptions });
    };
  }

  private getInitialPopulation(): Gene[] {
    const genes = getRandomGenes(
      this.fabric,
      this.patternPieces,

      {
        populationSize: this.ga.options.populationSize,
        seedRandomGenerator: this.seed ? true : false,
      },
    );
    return genes;
  }
}
