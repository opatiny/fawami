import type { Image } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';
import { getRandomPieces } from '../getRandomPieces.ts';

import { Gene } from './Gene.ts';

export interface GetRandomGenesOptions {
  /**
   * Number of genes to generate.
   * @default 10
   */
  populationSize?: number;
  /**
   * Whether to rotate pieces randomly.
   * @default false
   */
  rotatePieces?: boolean;
  /**
   * Should the random generator be seeded for each gene? If true, you will get the same genes each time.
   * @default false
   */
  seedRandomGenerator?: boolean;
}

/**
 * Generate an array of random genes.
 * @param fabric - The fabric on which to place the pieces
 * @param pieces - Pieces to place.
 * @param options - Options for generating random genes
 * @returns An array of random genes
 */
export function getRandomGenes(
  fabric: Image,
  pieces: PatternPieces,
  options: GetRandomGenesOptions = {},
) {
  const {
    populationSize = 10,
    seedRandomGenerator = false,
    rotatePieces = false,
  } = options;

  const genes: Gene[] = [];

  for (let i = 0; i < populationSize; i++) {
    const randomPieces = getRandomPieces(fabric, pieces, {
      rotatePieces,
      seed: seedRandomGenerator ? i : undefined,
    });
    const gene = new Gene(randomPieces);
    genes.push(gene);
  }

  return genes;
}
