import type { PatternPieces } from '../PatternPiece.ts';
import { getIntersectionMatrix } from '../utils/getIntersectionMatrix.ts';
import { getUsedLength } from '../utils/getUsedLength.ts';

import { DefaultFitnessOptions } from './Gene.ts';

export interface GetFitnessOptions {
  overlapWeight: number;
  lengthWeight: number;
  debug?: boolean;
}

export interface FitnessData {
  overlapArea: number;
  usedLength: number;
  score: number;
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
  options: GetFitnessOptions = DefaultFitnessOptions,
): FitnessData {
  const { overlapWeight, lengthWeight, debug = false } = options;
  const intersectionMatrix = getIntersectionMatrix(pieces);
  const overlapArea = intersectionMatrix.sum() / 2;
  const usedLength = getUsedLength(pieces);
  if (debug) {
    console.log('getFitness:', {
      totalOverlapArea: overlapArea,
      overlapWeight,
    });
    console.log('getFitness:', { usedLength, lengthWeight });
  }
  // we want to minimize both totalOverlapArea and usedLength
  const score = overlapWeight * overlapArea + lengthWeight * usedLength;
  return {
    overlapArea,
    usedLength,
    score,
  };
}
