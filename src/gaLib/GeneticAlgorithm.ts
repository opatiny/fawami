// this should be completely generic in order to be used in other projects

import { Random } from 'ml-random';

import { getDefaultSeed } from '../utils/getDefaultSeed.ts';

import { getDefaultOptions } from './getDefaultOptions.ts';
import { getProbabilities } from './getProbabilities.ts';

export interface ScoredIndividual<Type> {
  data: Type;
  score: number;
}

export type ScoreType = 'max' | 'min';

type CrossoverFunc<Type> = (parent1: Type, parent2: Type) => [Type, Type];

type MutationFunc<Type> = (individual: Type) => Type;

type FitnessFunc<Type> = (individual: Type) => number;

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
   * Population size
   * @default 100
   */
  populationSize: number;
  /**
   * Seed for the random number generator
   * @default A random seed
   */
  seed: number;
  /**
   * Number of individuals to select that are the most diverse.
   * Should be less than population size.
   * Set to 0 to disable diversity selection.
   * @default 10
   */
  nbDiverseIndividuals: number;
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
  public population: Array<ScoredIndividual<Type>>;
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
  private randomGen: Random;

  public constructor(
    config: ConfigGA<Type>,
    userOptions: OptionsGA<Type> = {},
  ) {
    const { seed = getDefaultSeed() } = userOptions;

    const defaultOptions = getDefaultOptions<Type>(seed);

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

    if (
      options.nbDiverseIndividuals > options.populationSize ||
      options.nbDiverseIndividuals < 0
    ) {
      throw new Error(
        `Number of diverse individuals (${options.nbDiverseIndividuals}) must be between 0 and population size (${options.populationSize})`,
      );
    }

    // config
    this.fitness = config.fitnessFunction;
    this.crossover = config.crossoverFunction;
    this.mutate = config.mutationFunction;
    this.scoreType = config.scoreType;

    // options
    this.options = options;

    // private
    this.randomGen = new Random(seed);

    // results
    this.population = config.intitialPopulation.map((individual) => ({
      data: individual,
      score: this.fitness(individual),
    }));
    this.bestScoredIndividuals = [];
    this.iteration = 0;
  }

  public computeNextGeneration(debug = false): void {
    // create random generator
    const randomGen = this.randomGen;

    const originalIndividuals = this.population.map((ind) => ind.data);

    const crossovered: Type[] = [];
    // apply crossover
    if (this.options.enableCrossover) {
      const nbCrossovers = Math.floor(this.options.populationSize / 2);

      if (debug) {
        console.log(`Performing ${nbCrossovers} crossovers`);
      }

      // compute probabilities for selection based on fitness scores
      const probabilities = getProbabilities(this.population, {
        exponent: this.options.probabilityExponent,
      });

      const indices = this.population.map((_, index) => index);
      for (let i = 0; i < nbCrossovers; i++) {
        const parentsIndices = randomGen.choice(indices, {
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

    const newIndividuals = [...crossovered, ...mutated];
    const newScoredIndividuals: Array<ScoredIndividual<Type>> =
      newIndividuals.map((individual) => ({
        data: individual,
        score: this.fitness(individual),
      }));

    const newPopulation = [...this.population, ...newScoredIndividuals];

    // sort by fitness score
    if (this.scoreType === 'max') {
      newPopulation.sort((a, b) => b.score - a.score);
    } else {
      newPopulation.sort((a, b) => a.score - b.score);
    }

    this.population = newPopulation.slice(
      0,
      this.options.populationSize - this.options.nbDiverseIndividuals,
    );

    // select most diverse individuals if needed
    if (this.options.nbDiverseIndividuals > 0) {
      // there is a probability that one of the individuals selected is already in the population
      const diverseIndividuals = this.options.getDistantIndividuals(
        newPopulation,
        this.options.nbDiverseIndividuals,
      );
      this.population.push(...diverseIndividuals);
    }

    this.iteration++;
    this.bestScoredIndividuals.push(this.population[0]);
  }

  public getScores(): number[] {
    return this.population.map((ind) => ind.score);
  }

  public getBestScores(): number[] {
    return this.bestScoredIndividuals.map((ind) => ind.score);
  }

  public evolve(nbGenerations: number, debug = false): void {
    for (let i = 0; i < nbGenerations; i++) {
      if (debug) {
        console.log(`Current generation: ${this.iteration}`);
        console.log('Current scores:', this.getScores());
      }
      this.computeNextGeneration();
    }
  }
}
