import { XSadd } from 'ml-xsadd';

import { getDefaultSeed } from '../utils/getDefaultSeed.ts';

import { Gene } from './Gene.ts';

export interface Crossover1PointOptions {
  /**
   * Seed for random number generator.
   * @default A random seed
   */
  seed?: number;
  /**
   * Minimum fraction of the gene to crossover. A value between 0 and 0.5.
   * @default 0
   */
  minCrossoverFraction?: number;

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
    seed = getDefaultSeed(),
    minCrossoverFraction = 0,
    debug = false,
  } = options;

  if (parent1.data.length !== parent2.data.length) {
    throw new Error('crossover1Point: Both parents must have the same length');
  }

  if (minCrossoverFraction < 0 || minCrossoverFraction > 0.5) {
    throw new Error(
      `minCrossoverFraction must be between 0 and 0.5, got ${minCrossoverFraction}`,
    );
  }

  const xsadd = new XSadd(seed);

  const length = parent1.data.length;

  const minCrossoverPoint = Math.floor(length * minCrossoverFraction);
  const crossoverLength = length - 2 * minCrossoverPoint;

  const crossoverPoint =
    minCrossoverPoint + Math.floor(xsadd.getFloat() * crossoverLength);

  if (debug) {
    console.log(`crossover point: ${crossoverPoint}, genes length: ${length}`);
  }

  const child1Pieces = [
    ...parent1.data.slice(0, crossoverPoint),
    ...parent2.data.slice(crossoverPoint),
  ];
  const child2Pieces = [
    ...parent2.data.slice(0, crossoverPoint),
    ...parent1.data.slice(crossoverPoint),
  ];

  const child1 = new Gene(child1Pieces);
  const child2 = new Gene(child2Pieces);

  return [child1, child2];
}
