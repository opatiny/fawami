import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';
import {
  GeneticAlgorithm,
  type OptionsGA,
  type ScoredIndividual,
  type ScoreType,
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
  public fitnessWeights: FitnessWeights;
  public mutateOptions?: MutateOptions;
  public crossoverOptions?: CrossoverOptions;

  public readonly ga: GeneticAlgorithm<Gene>;

  public constructor(
    fabric: Image,
    patternPieces: PatternPiece[],
    options: OptionsTextileGA = {},
  ) {
    const {
      seed = getDefaultSeed(),
      optionsGA,
      fitnessWeights,
      mutateOptions,
      crossoverOptions,
    } = options;

    // create correct options for GA
    const defaultOptionsGA = getDefaultOptions<Gene>(seed);

    const gaOptions: OptionsGA<Gene> = {
      ...defaultOptionsGA,
      ...optionsGA,
    };

    gaOptions.seed = seed;

    this.patternPieces = patternPieces;
    this.fabric = fabric;

    // create correct config for GA
    const gaConfig = {
      intitialPopulation: this.getInitialPopulation(gaOptions.populationSize),
      crossoverFunction: this.getCrossoverFunction(seed, crossoverOptions),
      mutationFunction: this.getMutationFunction(seed, mutateOptions),
      fitnessFunction: this.getFitnessFunction(),
      scoreType: 'min' as ScoreType,
    };

    // todo: improve the distance function
    gaOptions.getDistantIndividuals = this.getDistantIndividualsFunction();

    // assign values to class properties

    this.seed = seed;
    this.fitnessWeights = { ...DefaultFitnessWeights, ...fitnessWeights };
    this.mutateOptions = { ...DefaultMutateOptions, ...mutateOptions };
    this.crossoverOptions = { ...DefaultCrossoverOptions, ...crossoverOptions };

    this.ga = new GeneticAlgorithm<Gene>(gaConfig, gaOptions);
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

  private getInitialPopulation(populationSize: number): Gene[] {
    const genes = getRandomGenes(this.fabric, this.patternPieces, {
      populationSize,
      seedRandomGenerator: this.seed ? true : false,
    });
    return genes;
  }

  private getDistantIndividualsFunction() {
    return (population: ScoredIndividual<Gene>[], nbIndividuals: number) => {
      const genes = population.map((individual) => individual.data);
      const distantIndividuals = getDistantGenes(genes, {
        numberOfGenes: nbIndividuals,
      });
      return distantIndividuals.map((gene) => ({
        data: gene,
        score: gene.fitness.score,
      }));
    };
  }

  public getBestScores(): number[] {
    return this.ga.bestScoredIndividuals.map((ind) => ind.score);
  }

  public plotScores(path: string): void {
    // todo
  }

  public saveOptions(path: string): void {
    // todo
  }

  public saveBestGenesImages(path: string): void {
    // todo
  }

  public savePopulationImages(path: string): void {
    // todo
  }
}
