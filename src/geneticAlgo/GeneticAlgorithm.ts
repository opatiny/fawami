// this should be completely generic in order to be used in other projects
import { Random } from 'ml-random';

import { getDefaultSeed } from '../utils/getDefaultSeed.ts';

interface ScoredIndividual<Type> {
  individual: Type;
  score: number;
}

type CrossoverFunc<Type> = (parent1: Type, parent2: Type) => [Type, Type];

type MutationFunc<Type> = (gene: Type) => Type;

type FitnessFunc<Type> = (gene: Type) => number;

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
  scoreDirection: 'max' | 'min';
}

export interface OptionsGA<Type> {
  /**
   * Function to select the most diverse individuals in the population
   * @default Takes the N random individuals
   */
  distantIndividualsFunction?: DistantIndividualsFunc<Type>;

  /**
   * Enable crossover?
   * @default true
   */
  enableCrossover?: boolean;

  /**
   * Enable mutation?
   * @default true
   */
  enableMutation?: boolean;

  /**
   * Population size
   * @default 100
   */
  populationSize?: number;
  /**
   * Seed for the random number generator
   * @default A random seed
   */
  seed?: number;
  /**
   * Number of individuals to select that are the most diverse.
   * Should be less than population size.
   * Set to 0 to disable diversity selection.
   * @default 10
   */
  nbDiverseIndividuals?: number;
}

export class GeneticAlgorithm<Type> {
  public population: Array<ScoredIndividual<Type>>;
  public crossover: CrossoverFunc<Type>;
  public mutate: MutationFunc<Type>;
  public fitness: FitnessFunc<Type>;

  public distantIndividuals: DistantIndividualsFunc<Type>;
  public nbDiverseIndividuals: number;
  public enableCrossover: boolean;
  public enableMutation: boolean;
  public populationSize: number;
  public seed: number;

  /**
   * Number of iterations performed
   */
  public iteration = 0;
  /**
   * Individuals with the best score at each iteration
   */
  public readonly bestScoredIndividuals: Array<ScoredIndividual<Type>>;
  public readonly scoreDirection: 'max' | 'min';

  public constructor(config: ConfigGA<Type>, options: OptionsGA<Type> = {}) {
    const { seed = getDefaultSeed() } = options;

    function randomDistantIndividuals<Type>(
      population: Type[],
      nbIndividuals: number,
    ): Type[] {
      const randomGen = new Random(seed);
      return randomGen.choice(population, {
        size: nbIndividuals,
        replace: false,
      });
    }

    console.log(options);

    const {
      enableCrossover = true,
      enableMutation = true,
      populationSize = 100,
      nbDiverseIndividuals = 10,
      distantIndividualsFunction = randomDistantIndividuals,
    } = options;

    if (config.intitialPopulation.length !== populationSize) {
      throw new Error(
        `Initial population size (${config.intitialPopulation.length}) must match the populationSize parameter (${populationSize})`,
      );
    }

    if (nbDiverseIndividuals > populationSize || nbDiverseIndividuals < 0) {
      throw new Error(
        `Number of diverse individuals (${nbDiverseIndividuals}) must be between 0 and population size (${populationSize})`,
      );
    }

    this.fitness = config.fitnessFunction;
    this.population = config.intitialPopulation.map((individual) => ({
      individual,
      score: this.fitness(individual),
    }));
    this.crossover = config.crossoverFunction;
    this.mutate = config.mutationFunction;

    this.distantIndividuals = distantIndividualsFunction;
    this.enableCrossover = enableCrossover;
    this.enableMutation = enableMutation;
    this.populationSize = populationSize;
    this.seed = seed;
    this.nbDiverseIndividuals = nbDiverseIndividuals;
    this.bestScoredIndividuals = [];
    this.scoreDirection = config.scoreDirection;
  }

  public computeNextGeneration(debug = false): void {
    // create random generator
    const randomGen = new Random(this.seed);

    const originalIndividuals = this.population.map((ind) => ind.individual);
    console.log('Original Individuals:', originalIndividuals);

    const crossovered: Type[] = [];
    // apply crossover
    if (this.enableCrossover) {
      const nbCrossovers = Math.floor(this.populationSize / 2);

      if (debug) {
        console.log(`Performing ${nbCrossovers} crossovers`);
      }

      for (let i = 0; i < nbCrossovers; i++) {
        // todo: enhance selection of parents

        const parents = randomGen.choice(originalIndividuals, {
          size: 2,
          replace: false,
        });
        const [child1, child2] = this.crossover(parents[0], parents[1]);
        crossovered.push(child1, child2);
      }
    }

    console.log('Crossovered Individuals:', crossovered);

    // apply mutation to original and crossovered individuals
    const mutated: Type[] = [];
    if (this.enableMutation) {
      for (let individual of [...originalIndividuals, ...crossovered]) {
        individual = this.mutate(individual);
        mutated.push(individual);
      }
    }
    console.log('Mutated Individuals:', mutated);

    const newIndividuals = [...crossovered, ...mutated];
    const newScoredIndividuals: Array<ScoredIndividual<Type>> =
      newIndividuals.map((individual) => ({
        individual,
        score: this.fitness(individual),
      }));

    const newPopulation = [...this.population, ...newScoredIndividuals];

    // sort by fitness score
    if (this.scoreDirection === 'max') {
      newPopulation.sort((a, b) => b.score - a.score);
    } else {
      newPopulation.sort((a, b) => a.score - b.score);
    }

    this.population = newPopulation.slice(
      0,
      this.populationSize - this.nbDiverseIndividuals,
    );
    // select most diverse individuals if needed
    if (this.nbDiverseIndividuals > 0) {
      // there is a probability that one of the individuals selected is already in the population
      const diverseIndividuals = this.distantIndividuals(
        newPopulation,
        this.nbDiverseIndividuals,
      );
      this.population.push(...diverseIndividuals);
    }

    this.iteration++;
    this.bestScoredIndividuals.push(this.population[0]);
  }
}
