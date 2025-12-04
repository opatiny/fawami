import { mkdir } from 'fs/promises';
import fsExtra from 'fs-extra';

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
import { getDistanceMatrix } from './utils/getDistanceMatrix.ts';
import { plotScores, type PlotScoresOptions } from '../utils/plotScores.ts';
import { plotHeatMap, type PlotHeatMapOptions } from '../utils/plotHeatMap.ts';
import { Random } from 'ml-random';
import { saveConfig, type SaveConfigOptions } from './saveConfig.ts';
import { join } from 'node:path';

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
  public readonly outdir?: string;

  public readonly ga: GeneticAlgorithm<Gene>;

  private randomGen: Random;

  public constructor(
    fabric: Image,
    patternPieces: PatternPiece[],
    options: OptionsTextileGA = {},
  ) {
    // get todays date as a string YYYY-MM-DD to use in outdir name
    const today = new Date().toISOString().slice(0, 10);
    const defaultOutdir = join(import.meta.dirname, today);
    const {
      seed = getDefaultSeed(),
      optionsGA,
      fitnessWeights,
      mutateOptions,
      crossoverOptions,
      outdir = defaultOutdir,
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
      ), // it is in defaultOptionsGA
      crossoverFunction: this.getCrossoverFunction(crossoverOptions),
      mutationFunction: this.getMutationFunction(mutateOptions),
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

    this.randomGen = new Random(seed);

    this.ga = new GeneticAlgorithm<Gene>(gaConfig, gaOptions);

    // ensure outdir exists (sync)
    mkdir(this.outdir, { recursive: true }).catch((err) => {
      console.error('Error creating outdir:', err);
    });
    // empty output directory
    fsExtra.emptyDirSync(this.outdir);
  }

  private getFitnessFunction() {
    return (gene: Gene) => {
      return gene.fitness.score;
    };
  }

  private getCrossoverFunction(options?: CrossoverOptions) {
    return (parent1: Gene, parent2: Gene): [Gene, Gene] => {
      return crossover1Point(parent1, parent2, {
        randomGen: this.randomGen,
        ...options,
        debug: false,
      });
    };
  }

  private getMutationFunction(mutateOptions?: MutateOptions) {
    return (gene: Gene): Gene => {
      return mutateTranslate(this.fabric, gene, {
        randomGen: this.randomGen,
        ...mutateOptions,
      });
    };
  }

  private getInitialPopulation(populationSize: number): Gene[] {
    const genes = getRandomGenes(this.fabric, this.patternPieces, {
      populationSize,
      randomGen: this.randomGen,
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

  /**
   * Compute the distances between all individuals of the current population.
   * @returns The distance matrix
   */
  public getDistanceMatrix(): Matrix {
    const genes = this.ga.population.map((ind) => ind.data);
    return getDistanceMatrix(genes);
  }

  public plotBestScores(options: PlotScoresOptions = {}): void {
    const scores = this.getBestScores();
    plotScores(scores, { name: 'bestScores.svg', ...options });
  }

  /**
   * Plot the distance between the individuals as a heat map. Green indicates that the individuals
   * are similar, red that they are different.
   * @param options
   */
  public plotDistanceHeatmap(options: PlotHeatMapOptions = {}): void {
    const distances = this.getDistanceMatrix();
    plotHeatMap(distances, {
      path: this.outdir,
      name: 'distanceHeatmap.svg',
      ...options,
    });
  }

  public async saveConfig(options: SaveConfigOptions = {}): Promise<void> {
    await saveConfig(this, options);
  }

  /**
   * Save images of the best gene of each iteration
   * @param options - Options
   */
  public saveBestGenesImages(options: SavePopulationImagesOptions = {}): void {
    const { path = this.outdir } = options;
    const genes = this.ga.bestScoredIndividuals.map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: path,
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
    const { path = this.outdir } = options;
    const genes = this.ga.population.map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: path,
      outdir: 'population',
      nameBase: 'gene',
      ...options,
    });
  }
}
