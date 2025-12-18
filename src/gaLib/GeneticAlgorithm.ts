// this should be completely generic in order to be used in other projects

import { Random } from 'ml-random';

import { getDefaultOptions } from './getDefaultOptions.ts';
import { getProbabilities } from './utils/getProbabilities.ts';
import { getMinDistanceToElite } from './utils/getMinDistanceToElite.ts';
import { smartGetNextGen } from './smartGetNextGen.ts';
import { defaultGetNextGen } from './defaultGetNextGen.ts';

export interface ScoredIndividual<Type> {
  data: Type;
  score: number;
}

type CrossoverFunc<Type> = (parent1: Type, parent2: Type) => [Type, Type];

type MutationFunc<Type> = (individual: Type) => Type;

/**
 * Function computing the fitness score of an individual.
 * The higher the score, the better the individual.
 * If you want to minimize the score, compute 1/score instead.
 */
type FitnessFunc<Type> = (individual: Type) => number;

type DistanceFunc<Type> = (
  gene1: ScoredIndividual<Type>,
  gene2: ScoredIndividual<Type>,
) => number;

type DistantIndividualsFunc<Type> = (
  population: Array<ScoredIndividual<Type>>,
  nbIndividuals: number,
) => Array<ScoredIndividual<Type>>;

export interface ConfigGA<Type> {
  intitialPopulation: Type[];

  crossoverFunction: CrossoverFunc<Type>;

  mutationFunction: MutationFunc<Type>;
  /**
   * Function to compute the fitness score of an individual.
   * The higher the score, the better the individual.
   * If you want to minimize the score, compute -score instead.
   */
  fitnessFunction: FitnessFunc<Type>;
}

/**
 * Internal options with all fields required
 */
export interface InternalOptionsGA<Type> {
  /**
   * Pick function to get the next generation
   * @default 'default'
   */
  nextGenFunction: 'default' | 'smart';
  /**
   * Function to select the most diverse individuals in the population
   * @default Takes the N random individuals
   */
  getDistantIndividuals: DistantIndividualsFunc<Type>;
  /** Function to compute the distance between two individuals
   * @default Absolute difference between their fitness scores
   */
  getDistance: DistanceFunc<Type>;
  /**
   * Enable crossover?
   * @default true
   */
  enableCrossover: boolean;
  /**
   * Enable mutation?
   * @default true
   */
  enableMutation: boolean;
  /**
   * Initial population size
   * @default 100
   */
  initialPopulationSize: number;
  /**
   * Population size
   * @default 100
   */
  populationSize: number;
  /**
   * A random number generator
   */
  randomGen: Random;
  /**
   * Number of best individuals to keep. The rest of the population will be kept as diverse as possible.
   * @default 5
   */
  eliteSize: number;
  /**
   * Exponent to apply to the score when computing probabilities for selecting parents for crossover.
   * @default 1
   */

  probabilityExponent: number;
  /**
   * Enable debug mode
   * @default false
   */
  debug: boolean;
}

/**
 * Type with all options actually optional
 */
export type OptionsGA<Type> = Partial<InternalOptionsGA<Type>>;

export class GeneticAlgorithm<Type> {
  // config
  public crossover: CrossoverFunc<Type>;
  public mutate: MutationFunc<Type>;
  public fitness: FitnessFunc<Type>;

  // options
  public readonly options: InternalOptionsGA<Type>;

  // results
  /**
   * Population at the current iteration
   */
  // public population: Array<ScoredIndividual<Type>>;
  public elitePopulation: Array<ScoredIndividual<Type>>;
  public diversePopulation: Array<ScoredIndividual<Type>>;
  /**
   * Number of diverse individuals to keep at each iteration
   */
  public readonly nbDiverseIndividuals: number;
  /**
   * Number of iterations performed
   */
  public iteration = 0;
  /**
   * Individuals with the best score at each iteration
   */
  public readonly bestScoredIndividuals: Array<ScoredIndividual<Type>>;
  /**
   * Random number generator instance
   */
  public readonly randomGen: Random;

  /**
   * Minimal distance to elite individuals for each diverse individual
   */
  public readonly minDistancesToElite: number[] = [];

  public constructor(
    config: ConfigGA<Type>,
    userOptions: OptionsGA<Type> = {},
  ) {
    const { randomGen = new Random() } = userOptions;

    this.randomGen = randomGen;

    const defaultOptions = getDefaultOptions<Type>(this.randomGen);

    const options: InternalOptionsGA<Type> = {
      ...defaultOptions,
      ...userOptions,
    };

    if (options.debug) {
      console.log(userOptions);
    }

    if (config.intitialPopulation.length !== options.populationSize) {
      throw new Error(
        `Initial population size (${config.intitialPopulation.length}) must match the populationSize parameter (${options.populationSize})`,
      );
    }

    if (options.eliteSize > options.populationSize || options.eliteSize < 1) {
      throw new Error(
        `Size of elite (${options.eliteSize}) must be between 1 and population size (${options.populationSize})`,
      );
    }

    // config
    this.fitness = config.fitnessFunction;
    this.crossover = config.crossoverFunction;
    this.mutate = config.mutationFunction;
    // options
    this.options = options;
    this.nbDiverseIndividuals =
      this.options.populationSize - this.options.eliteSize;

    // results
    const initialPopulation = config.intitialPopulation.map((individual) => ({
      data: individual,
      score: this.fitness(individual),
    }));

    this.elitePopulation = initialPopulation.slice(0, this.options.eliteSize);
    this.diversePopulation = initialPopulation.slice(this.options.eliteSize);
    this.initialiseMinDistances(); // really important not to forget this step

    // sort by fitness score
    this.bestScoredIndividuals = [];
    this.iteration = 0;
  }

  /**
   * Get the scores of the elite individuals at the current iteration
   * @returns The elite scores
   */
  public getEliteScores(): number[] {
    return this.elitePopulation.map((ind) => ind.score);
  }

  /**
   * Get the scores of the elite individuals at the current iteration
   * @returns The elite scores
   */
  public getScores(): number[] {
    const population = this.getPopulation();
    return population.map((ind) => ind.score);
  }

  /**
   * Get scores of best individuals of each generation.
   * @returns Array of best scores
   */
  public getBestScores(): number[] {
    return this.bestScoredIndividuals.map((ind) => ind.score);
  }

  public getPopulation(): Array<ScoredIndividual<Type>> {
    return this.elitePopulation.concat(this.diversePopulation);
  }

  public sortPopulationDescending(
    population: Array<ScoredIndividual<Type>>,
  ): void {
    population.sort((a, b) => b.score - a.score);
  }

  public getNextGeneration(debug = false): void {
    const { nextGenFunction } = this.options;
    if (nextGenFunction === 'default') {
      defaultGetNextGen(this, debug);
    } else if (nextGenFunction === 'smart') {
      smartGetNextGen(this, { debug });
    } else {
      throw new Error(`Unknown next generation function: ${nextGenFunction}`);
    }

    this.iteration++;
    this.bestScoredIndividuals.push(this.elitePopulation[0]);
  }

  public evolve(nbGenerations: number, debug = false): void {
    for (let i = 0; i < nbGenerations; i++) {
      if (debug) {
        console.log(`Current generation: ${this.iteration}`);
        console.log('Current elite scores:', this.getEliteScores());
      }
      this.getNextGeneration();
    }
  }

  public initialiseMinDistances(): void {
    if (this.minDistancesToElite.length === 0) {
      for (let i = 0; i < this.diversePopulation.length; i++) {
        const individual = this.diversePopulation[i];
        this.minDistancesToElite.push(getMinDistanceToElite(this, individual));
      }
    }
  }
}
