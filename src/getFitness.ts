import type { PatternPiece } from './PatternPiece.ts';
import type { PiecesLocations } from './PiecesLocations.ts';
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
 * @param locations - Locations of the pieces
 * @param options
 * @returns The fitness value
 */
export function getFitness(
  pieces: PatternPiece[],
  locations: PiecesLocations,
  options: GetFitnessOptions = {},
): number {
  const { overlapWeight = 1, lengthWeight = 10, debug = false } = options;
  const intersectionMatrix = getIntersectionMatrix(pieces, locations);
  const totalIntersection = intersectionMatrix.sum() / 2;
  const usedLength = getUsedLength(pieces);
  if (debug) {
    console.log('getFitness: Overlap area:', totalIntersection);
    console.log('getFitness: Length of fabric used:', usedLength);
  }
  // we want to minimize both totalIntersection and usedLength
  // we can use a weighted sum of both, with weights that can be adjusted

  const fitness = overlapWeight * totalIntersection + lengthWeight * usedLength;
  return fitness;
}
