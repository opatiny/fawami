import { Gene } from './Gene.ts';
import { Random } from 'ml-random';

export interface CrossoverOptions {
  /**
   * Minimum fraction of the gene to crossover. A value between 0 and 0.5.
   * @default 0
   */
  minCrossoverFraction?: number;
}

export const DefaultCrossoverOptions: CrossoverOptions = {
  minCrossoverFraction: 0,
};

export interface Crossover1PointOptions extends CrossoverOptions {
  /**
   * Random generator
   * @default New random generator without seed
   */
  randomGen?: Random;

  debug?: boolean;
}

/**
 * Perform one-point crossover between two parent genes to produce two children.
 * @param parent1 - First parent gene
 * @param parent2 - Second parent gene
 * @param options - Options for crossover
 * @returns Two child genes resulting from the crossover
 */
export function crossover1Point(
  parent1: Gene,
  parent2: Gene,
  options: Crossover1PointOptions = {},
): [Gene, Gene] {
  const {
    randomGen = new Random(),
    minCrossoverFraction = DefaultCrossoverOptions.minCrossoverFraction!,
    debug = false,
  } = options;

  if (parent1.patternPieces.length !== parent2.patternPieces.length) {
    throw new Error('crossover1Point: Both parents must have the same length');
  }

  if (minCrossoverFraction < 0 || minCrossoverFraction > 0.5) {
    throw new Error(
      `minCrossoverFraction must be between 0 and 0.5, got ${minCrossoverFraction}`,
    );
  }

  const length = parent1.patternPieces.length;

  const minCrossoverPoint = Math.ceil(length * minCrossoverFraction);
  const crossoverLength = length - 2 * minCrossoverPoint;

  const crossoverPoint =
    minCrossoverPoint + Math.floor(randomGen.random() * crossoverLength);

  if (debug) {
    console.log(`crossover point: ${crossoverPoint}, genes length: ${length}`);
  }

  const child1Pieces = [
    ...parent1.patternPieces.slice(0, crossoverPoint),
    ...parent2.patternPieces.slice(crossoverPoint),
  ];
  const child2Pieces = [
    ...parent2.patternPieces.slice(0, crossoverPoint),
    ...parent1.patternPieces.slice(crossoverPoint),
  ];

  const child1 = new Gene(child1Pieces);
  const child2 = new Gene(child2Pieces);

  return [child1, child2];
}
