import type { Image } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';
import { getRandomPieces } from '../getRandomPieces.ts';

import { Gene } from './Gene.ts';
import { Random } from 'ml-random';
import { DefaultFitnessWeights, type FitnessWeights } from './getFitness.ts';

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
   * Random generator to use
   * @default New random generator without seed
   */
  randomGen?: Random;
  /**
   * Fitness weights to compute the score of the new genes.
   */
  fitnessWeights?: FitnessWeights;
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
    randomGen = new Random(),
    rotatePieces = false,
    fitnessWeights = DefaultFitnessWeights,
  } = options;

  const genes: Gene[] = [];

  for (let i = 0; i < populationSize; i++) {
    const randomPieces = getRandomPieces(fabric, pieces, {
      rotatePieces,
      randomGen: randomGen,
    });

    const gene = new Gene(fabric, randomPieces, { fitnessWeights });
    genes.push(gene);
  }

  return genes;
}
