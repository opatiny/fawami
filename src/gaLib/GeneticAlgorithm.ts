// this should be completely generic in order to be used in other projects

import { Random } from 'ml-random';

import { getDefaultOptions } from './getDefaultOptions.ts';
import { getProbabilities } from './utils/getProbabilities.ts';
import { getMinDistanceToElite } from './utils/getMinDistanceToElite.ts';

export interface ScoredIndividual<Type> {
  data: Type;
  score: number;
}

export type ScoreType = 'max' | 'min';

type CrossoverFunc<Type> = (parent1: Type, parent2: Type) => [Type, Type];

type MutationFunc<Type> = (individual: Type) => Type;

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
   * Function to compute the fitness score of an individual
   */
  fitnessFunction: FitnessFunc<Type>;
  /**
   * Define whether a higher score is better ('max') or a lower score is better ('min')
   */
  scoreType: ScoreType;
}

/**
 * Internal options with all fields required
 */
export interface InternalOptionsGA<Type> {
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
  public readonly scoreType: ScoreType;

  // options
  public options: InternalOptionsGA<Type>;

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
  private nbDiverseIndividuals: number;
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
    this.scoreType = config.scoreType;

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

  public getBestScores(): number[] {
    return this.bestScoredIndividuals.map((ind) => ind.score);
  }

  public getPopulation(): Array<ScoredIndividual<Type>> {
    return this.elitePopulation.concat(this.diversePopulation);
  }

  public getNextGeneration(debug = false): void {
    const population = this.getPopulation();
    const originalIndividuals = population.map((ind) => ind.data);

    const crossovered: Type[] = [];
    // apply crossover
    if (this.options.enableCrossover) {
      const nbCrossovers = Math.floor(this.options.populationSize / 2);

      if (debug) {
        console.log(`Performing ${nbCrossovers} crossovers`);
      }

      // compute probabilities for selection based on fitness scores
      const probabilities = getProbabilities(population, {
        exponent: this.options.probabilityExponent,
      });

      const indices = population.map((_, index) => index);
      for (let i = 0; i < nbCrossovers; i++) {
        const parentsIndices = this.randomGen.choice(indices, {
          size: 2,
          replace: false,
          // probabilities,
        });
        if (debug) {
          console.log({ parentsIndices });
        }
        const parents = [
          originalIndividuals[parentsIndices[0]],
          originalIndividuals[parentsIndices[1]],
        ];
        const [child1, child2] = this.crossover(parents[0], parents[1]);
        crossovered.push(child1, child2);
      }
    }

    // apply mutation to original and crossovered individuals
    const mutated: Type[] = [];
    if (this.options.enableMutation) {
      const toMutate = [...originalIndividuals, ...crossovered];
      for (const individual of toMutate) {
        const mutatedIndividual = this.mutate(individual);
        mutated.push(mutatedIndividual);
      }
    }

    const newIndividuals = mutated;
    const newScoredIndividuals: Array<ScoredIndividual<Type>> =
      newIndividuals.map((individual) => ({
        data: individual,
        score: this.fitness(individual),
      }));

    const newPopulation = [...population, ...newScoredIndividuals];

    // sort by fitness score
    if (this.scoreType === 'max') {
      newPopulation.sort((a, b) => b.score - a.score);
    } else {
      newPopulation.sort((a, b) => a.score - b.score);
    }

    this.elitePopulation = newPopulation.slice(0, this.options.eliteSize);

    // select most diverse individuals if needed
    if (this.nbDiverseIndividuals > 0) {
      // there is a probability that one of the individuals selected is already in the population
      const diverseIndividuals = this.options.getDistantIndividuals(
        newPopulation,
        this.nbDiverseIndividuals,
      );
      this.diversePopulation = diverseIndividuals;
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

  // PRIVATE METHODS
  public initialiseMinDistances(): void {
    if (this.minDistancesToElite.length === 0) {
      for (let i = 0; i < this.diversePopulation.length; i++) {
        const individual = this.diversePopulation[i];
        this.minDistancesToElite.push(getMinDistanceToElite(this, individual));
      }
    }
  }
}
