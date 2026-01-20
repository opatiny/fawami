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
 * Perform a crossover between two parent genes to produce two children by randomly swapping some of the pieces.
 * @param parent1 - First parent gene
 * @param parent2 - Second parent gene
 * @param options - Options for crossover
 * @returns Two child genes resulting from the crossover
 */
export function crossoverRandomPieces(
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
    throw new Error(
      'crossoverRandomPieces: Both parents must have the same length',
    );
  }

  if (minCrossoverFraction < 0 || minCrossoverFraction > 0.5) {
    throw new Error(
      `minCrossoverFraction must be between 0 and 0.5, got ${minCrossoverFraction}`,
    );
  }

  const nbPiecesToSwap = Math.round(
    parent1.patternPieces.length * minCrossoverFraction,
  );
  const swapIndices = randomGen.choice(parent1.patternPieces.length, {
    size: nbPiecesToSwap,
    replace: false,
  });

  const child1Pieces = parent1.patternPieces.slice();
  const child2Pieces = parent2.patternPieces.slice();

  for (const index of swapIndices) {
    child1Pieces[index] = parent2.patternPieces[index];
    child2Pieces[index] = parent1.patternPieces[index];
  }
  const fabric = parent1.fabric;

  const newGeneOptions = {
    fitnessWeights: parent1.fitnessWeights,
  };

  const child1 = new Gene(fabric, child1Pieces, newGeneOptions);
  const child2 = new Gene(fabric, child2Pieces, newGeneOptions);

  return [child1, child2];
}
