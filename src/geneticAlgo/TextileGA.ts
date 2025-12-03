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

import {
  savePopulationImages as saveImages,
  type SavePopulationImagesOptions,
} from '../utils/savePopulationImages.ts';
import { Matrix } from 'ml-matrix';
import { getDistanceMatrix as getDistances } from './utils/getDistanceMatrix.ts';
import { plotScores, type PlotScoresOptions } from '../utils/plotScores.ts';

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
  /**
   * Path to output directory for saving data.
   */
  outdir?: string;
}

export class TextileGA {
  /**
   * Array of pattern pieces as extracted from the original pattern image.
   */
  public readonly patternPieces: PatternPiece[];
  public readonly fabric: Image;

  public readonly seed: number;
  public fitnessWeights: FitnessWeights;
  public mutateOptions?: MutateOptions;
  public crossoverOptions?: CrossoverOptions;
  public outdir?: string;

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
      outdir = import.meta.dirname,
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
      intitialPopulation: this.getInitialPopulation(
        gaOptions.populationSize as number,
        seed,
      ), // it is in defaultOptionsGA
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
    this.outdir = outdir;

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

  private getInitialPopulation(populationSize: number, seed: number): Gene[] {
    const genes = getRandomGenes(this.fabric, this.patternPieces, {
      populationSize,
      seedRandomGenerator: seed !== undefined ? true : false,
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

  public plotBestScores(options: PlotScoresOptions = {}): void {
    const scores = this.getBestScores();
    plotScores(scores, { name: 'bestScores.svg', ...options });
  }

  public plotDistanceHeatmap(path: string): void {
    // todo
  }

  public saveOptions(path: string): void {
    // todo
  }

  /**
   * Save images of the best gene of each iteration
   * @param options - Options
   */
  public saveBestGenesImages(options: SavePopulationImagesOptions = {}): void {
    const genes = this.ga.bestScoredIndividuals.map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: this.outdir,
      outdir: 'bestGenes',
      nameBase: 'iteration',
      ...options,
    });
  }

  /**
   * Save images of the current population
   * @param options - Options
   */
  public savePopulationImages(options: SavePopulationImagesOptions = {}): void {
    const genes = this.ga.population.map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: this.outdir,
      outdir: 'population',
      nameBase: 'gene',
      ...options,
    });
  }

  /**
   * Compute the distances between all individuals of the current population.
   * @returns The distance matrix
   */
  public getDistanceMatrix(): Matrix {
    const genes = this.ga.population.map((ind) => ind.data);
    return getDistances(genes);
  }
}
