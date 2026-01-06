import { mkdir } from 'fs/promises';

import type { Image } from 'image-js';

import { PatternPiece } from '../patternPiece/PatternPiece.ts';
import {
  GeneticAlgorithm,
  type OptionsGA,
  type ScoredIndividual,
} from '../gaLib/GeneticAlgorithm.ts';

import type { Gene } from './Gene.ts';
import {
  crossover1Point,
  DefaultCrossoverOptions,
  type CrossoverOptions,
} from './crossover1Point.ts';
import { DefaultFitnessWeights, type FitnessWeights } from './getFitness.ts';
import { DefaultMutateOptions, type MutateOptions } from './mutateTranslate.ts';
import { getRandomGenes } from './getRandomGenes.ts';
import { getDefaultSeed } from '../utils/getDefaultSeed.ts';
import { getDefaultOptions } from '../gaLib/getDefaultOptions.ts';
import {
  getDistantGenes,
  type GetDistantGenesOptions,
} from './getDistantGenes.ts';

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
import { createOrEmptyDir } from '../utils/createOrEmptyDir.ts';
import { mutateAndKeepBest } from './mutateAndKeepBest.ts';
import {
  DefaultDistanceOptions,
  getGenesDistance,
  type GetGenesDistanceOptions,
} from './utils/getGenesDistance.ts';
import { canPiecesFitInFabric } from '../utils/canPiecesFitInFabric.ts';
import { smartMutate } from './smartMutate.ts';
import { pushTopLeft } from './utils/pushTopLeft.ts';
import { sortGenesByScore } from './utils/sortGenesByScore.ts';
import {
  DefaultStats,
  saveResults,
  type SaveResultsOptions,
  type TextileGAStats,
} from './saveResults.ts';

export interface OptionsTextileGA {
  /**
   * Seed used for all random values in the genetic algorithm ("top-level" seed).
   */
  seed?: number;
  /**
   * Enable rotation of pattern pieces
   * @default false
   */
  enableRotation?: boolean;
  /**
   * Number of times to cut the pattern pieces in the fabric.
   * @default 1
   */
  nbCuts?: number;
  /**
   * Genetic algorithm options
   */
  optionsGA?: Omit<OptionsGA<Gene>, 'randomGen'>;
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
   * Distance computation options.
   */
  distanceOptions?: GetGenesDistanceOptions;
  /**
   * Path where to create the output directory.
   */
  path?: string;
  /**
   * Name of output directory for saving data.
   * @default today's date in YYYY-MM-DD format
   */
  dirname?: string;
}

export class TextileGA {
  /**
   * Array of pattern pieces as extracted from the original pattern image.
   */
  public readonly patternPieces: PatternPiece[];
  /**
   * Desired number of times to cut the pattern pieces in the fabric.
   * @default 1
   */
  public readonly nbCuts: number;
  public readonly fabric: Image;

  public readonly seed: number;
  public readonly enableRotation: boolean;
  public fitnessWeights: FitnessWeights;
  public mutateOptions?: MutateOptions;
  public crossoverOptions?: CrossoverOptions;
  public distanceOptions?: GetGenesDistanceOptions;

  private ga: GeneticAlgorithm<Gene>;

  private randomGen: Random;

  public readonly stats: TextileGAStats;

  // options for saving data
  public readonly outdir?: string;
  private readonly heatmapsPath?: string;
  private readonly populationImagesPath?: string;

  public constructor(
    fabric: Image,
    patternPieces: PatternPiece[],
    options: OptionsTextileGA = {},
  ) {
    // get todays date as a string YYYY-MM-DD to use in outdir name
    const today = new Date().toISOString().slice(0, 10);
    const {
      seed = getDefaultSeed(),
      nbCuts = 1,
      enableRotation = false,
      optionsGA,
      fitnessWeights,
      mutateOptions,
      crossoverOptions,
      distanceOptions,
      path = import.meta.dirname,
      dirname = today,
    } = options;

    // copy the pattern pieces in order to match nbCuts
    if (nbCuts < 1) {
      throw new Error('nbCuts must be at least 1');
    }
    const originalPieces = patternPieces.slice();
    for (let i = 1; i < nbCuts; i++) {
      for (const piece of originalPieces) {
        patternPieces.push(PatternPiece.clone(piece));
      }
    }
    if (canPiecesFitInFabric(fabric, patternPieces) === false) {
      throw new Error(
        'The pattern pieces cannot fit in the fabric (pieces surface is larger than fabric surface).',
      );
    }
    this.nbCuts = nbCuts;
    this.patternPieces = patternPieces;

    // create correct options for GA
    this.randomGen = new Random(seed);
    this.enableRotation = enableRotation;

    const defaultOptionsGA = getDefaultOptions<Gene>(this.randomGen);

    const gaOptions: OptionsGA<Gene> = {
      ...defaultOptionsGA,
      getDistance: this.getDistanceFunction(distanceOptions),
      ...optionsGA,
      randomGen: this.randomGen,
    };

    this.fabric = fabric;

    // create correct config for GA
    const gaConfig = {
      intitialPopulation: this.getInitialPopulation(
        gaOptions.initialPopulationSize as number,
        gaOptions.populationSize as number,
        fitnessWeights,
      ), // it is in defaultOptionsGA
      crossoverFunction: this.getCrossoverFunction(crossoverOptions),
      mutationFunction: this.getMutationFunction({
        ...DefaultMutateOptions,
        ...mutateOptions,
      }),
      fitnessFunction: this.getFitnessFunction(),
    };

    // todo: improve the distance function
    gaOptions.getDistantIndividuals = this.getDistantIndividualsFunction();
    // assign values to class properties
    this.seed = seed;
    this.fitnessWeights = { ...DefaultFitnessWeights, ...fitnessWeights };

    this.mutateOptions = { ...DefaultMutateOptions, ...mutateOptions };
    this.crossoverOptions = { ...DefaultCrossoverOptions, ...crossoverOptions };
    this.distanceOptions = { ...DefaultDistanceOptions, ...distanceOptions };

    this.ga = new GeneticAlgorithm<Gene>(gaConfig, gaOptions);
    this.stats = DefaultStats;

    // setup out directories
    this.outdir = join(path, dirname);
    createOrEmptyDir(this.outdir);

    this.heatmapsPath = join(this.outdir, 'heatmaps');
    createOrEmptyDir(this.heatmapsPath);

    this.populationImagesPath = join(this.outdir, 'populations');
    createOrEmptyDir(this.populationImagesPath);
  }

  private getFitnessFunction() {
    return (gene: Gene) => {
      // the minus sign is to have lower fitness correspond to better individuals
      return -gene.getFitnessScore();
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
    if (mutateOptions?.mutationFunction === 'smart') {
      return (gene: Gene): Gene => {
        if (mutateOptions?.pushTopLeft) {
          pushTopLeft(gene);
        }
        return smartMutate(this.fabric, gene, mutateOptions);
      };
    } else if (mutateOptions?.mutationFunction === 'mutateAndKeepBest') {
      return (gene: Gene): Gene => {
        if (mutateOptions?.pushTopLeft) {
          pushTopLeft(gene);
        }
        return mutateAndKeepBest(this.fabric, gene, {
          randomGen: this.randomGen,
          ...mutateOptions,
        }).at(-1) as Gene;
      };
    } else {
      throw new Error(
        `Unknown mutation function: ${mutateOptions?.mutationFunction}`,
      );
    }
  }

  private getInitialPopulation(
    initialPopulationSize: number,
    populationSize: number,
    fitnessWeights?: FitnessWeights,
  ): Gene[] {
    const genes = getRandomGenes(this.fabric, this.patternPieces, {
      populationSize: initialPopulationSize,
      randomGen: this.randomGen,
      fitnessWeights: fitnessWeights,
      rotatePieces: this.enableRotation,
    });
    // only keep individuals with best score
    sortGenesByScore(genes);
    genes.splice(populationSize);

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
        score: this.ga.fitness(gene),
      }));
    };
  }

  /**
   * Compute the distance between two genes.
   * @param gene1 - First gene
   * @param gene2 - Second gene
   * @returns Distance between the two genes
   */
  private getDistanceFunction(options?: GetDistantGenesOptions) {
    return (
      gene1: ScoredIndividual<Gene>,
      gene2: ScoredIndividual<Gene>,
    ): number => {
      const distance = getGenesDistance(gene1.data, gene2.data, options);
      return distance;
    };
  }

  public getNextGeneration(): void {
    const startTime = performance.now();
    // compute next generation
    this.ga.getNextGeneration();

    // save stats data
    const endTime = performance.now();
    const iterationTime = (endTime - startTime) / 1000; // in seconds
    this.stats.runTime.iterations.push(iterationTime);
    this.stats.runTime.total += iterationTime;
    this.stats.packings.push(
      this.ga.bestScoredIndividuals[
        this.ga.bestScoredIndividuals.length - 1
      ].data.getFitnessData().packing,
    );
  }

  public evolve(nbIterations: number, debug = false): void {
    for (let i = 0; i < nbIterations; i++) {
      if (debug) {
        console.log(`--- Iteration ${i + 1} ---`);
      }
      this.getNextGeneration();
      if (debug) {
        const currentBestGene = this.ga.bestScoredIndividuals.at(
          -1,
        ) as ScoredIndividual<Gene>;
        console.log('New best score: ', currentBestGene.data.getFitnessScore());
        console.log(
          `Iteration time: ${this.stats.runTime.iterations
            .at(-1)
            ?.toFixed(2)} s`,
        );
      }
    }
  }

  // PROPERTY GETTERS

  public getBestScores(): number[] {
    return this.ga.bestScoredIndividuals.map((ind) =>
      ind.data.getFitnessScore(),
    );
  }

  public getBestGenes(): Gene[] {
    return this.ga.bestScoredIndividuals.map((ind) => ind.data);
  }

  /**
   * Compute the distances between all individuals of the current population.
   * @returns The distance matrix
   */
  public getDistanceMatrix(): Matrix {
    const genes = this.ga.getPopulation().map((ind) => ind.data);
    return getDistanceMatrix(genes);
  }

  public getGaOptions(): OptionsGA<Gene> {
    return this.ga.options;
  }

  //  PLOT AND SAVE IMAGE

  public plotBestScores(options: Omit<PlotScoresOptions, 'path'> = {}): void {
    const scores = this.getBestScores();
    plotScores(scores, {
      path: this.outdir,
      name: 'convergencePlot.svg',
      ...options,
    });
  }

  /**
   * Plot the distance between the individuals as a heat map. Green indicates that the individuals
   * are similar, red that they are different.
   * @param options
   */
  public plotDistanceHeatmap(
    options: Omit<PlotHeatMapOptions, 'path'> = {},
  ): void {
    const distances = this.getDistanceMatrix();
    plotHeatMap(distances, {
      path: this.heatmapsPath,
      name: 'distanceHeatmap.svg',
      ...options,
    });
  }

  public async saveConfig(
    options: Omit<SaveConfigOptions, 'path'> = {},
  ): Promise<void> {
    await saveConfig(this, { ...options, outdir: this.outdir });
  }

  public async saveResults(options: SaveResultsOptions = {}): Promise<void> {
    await saveResults(this, options);
  }

  /**
   * Save images of the best gene of each iteration
   * @param options - Options
   */
  public saveBestGenesImages(
    options: Omit<SavePopulationImagesOptions, 'path'> = {},
  ): void {
    const genes = this.ga.bestScoredIndividuals.map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: this.outdir,
      dirname: 'bestGenes',
      nameBase: 'iteration',
      ...options,
    });
  }

  /**
   * Save images of the current population
   * @param options - Options
   */
  public savePopulationImages(
    options: Omit<SavePopulationImagesOptions, 'path'> = {},
  ): void {
    const genes = this.ga.getPopulation().map((ind) => ind.data);
    saveImages(this.fabric, genes, {
      path: this.populationImagesPath,
      dirname: 'population',
      nameBase: 'gene',
      ...options,
    });
  }
}
