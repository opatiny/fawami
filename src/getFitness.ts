import type { PatternPieces } from './PatternPiece.ts';
import { getIntersectionMatrix } from './utils/getIntersectionMatrix.ts';
import { getUsedLength } from './utils/getUsedLength.ts';

export interface GetFitnessOptions {
  overlapWeight?: number;
  lengthWeight?: number;
  debug?: boolean;
}

/**
 * Compute the fitness of a given arrangement of pieces.
 * The fitness is a weighted sum of the total intersection area and the length of fabric used.
 * Lower fitness is better.
 * @param pieces - Array of pattern pieces
 * @param options - Options for computing fitness
 * @returns The fitness value
 */
export function getFitness(
  pieces: PatternPieces,
  options: GetFitnessOptions = {},
): number {
  const { overlapWeight = 1, lengthWeight = 10, debug = false } = options;
  const intersectionMatrix = getIntersectionMatrix(pieces);
  const totalOverlapArea = intersectionMatrix.sum() / 2;
  const usedLength = getUsedLength(pieces);
  if (debug) {
    console.log('getFitness:', { totalOverlapArea, overlapWeight });
    console.log('getFitness:', { usedLength, lengthWeight });
  }
  // we want to minimize both totalOverlapArea and usedLength
  const fitness = overlapWeight * totalOverlapArea + lengthWeight * usedLength;
  return fitness;
}
