import type { Point } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';
import { getAverageOrigin } from '../utils/getAverageOrigin.ts';
import { getIntersectionMatrix } from '../utils/getIntersectionMatrix.ts';
import { getUsedLength } from '../utils/getUsedLength.ts';
import { computePacking } from '../utils/computePacking.ts';

export interface FitnessWeights {
  /**
   * Weight to minimize overlap area
   * @default 1
   */
  overlap: number;
  /**
   * Weight to minimize length of fabric used
   * @default 0
   */
  usedLength: number;
  /**
   * Weight to minimize average column position of pattern pieces
   * @default 10
   */
  averageColumn: number;
  /**
   * Weight to minimize average row position of pattern pieces
   * @default 10
   */
  averageRow: number;
  /**
   * Weight to maximize packing
   * @default 0
   */
  packing: number;
}

export const DefaultFitnessWeights: FitnessWeights = {
  overlap: 1,
  usedLength: 0,
  averageColumn: 10,
  averageRow: 10,
  packing: 0,
};

export interface GetFitnessOptions {
  debug?: boolean;
  weights?: FitnessWeights;
}

export interface FitnessData {
  /**
   * Total overlapping area between pieces (in pixels)
   */
  overlapArea: number;
  /**
   * Length of fabric used
   */
  usedLength: number;
  /**
   * Average origin of the pattern pieces. More powerful than usedLength because usedLength only puts the pressure on the right-most piece.
   */
  averageOrigin: Point;
  /**
   * Packing ratio (higher is better)
   */
  packing: number;
  /**
   * The overall fitness score (lower is better)
   */
  score: number;
}

/**
 * Compute the fitness of a given arrangement of pieces.
 * The fitness is a weighted sum of various parameters, such as overlap area or used length.
 * Lower fitness is better.
 * @param pieces - Array of pattern pieces
 * @param options - Options for computing fitness
 * @returns The fitness value
 */
export function getFitness(
  pieces: PatternPieces,
  options: GetFitnessOptions = {},
): FitnessData {
  const { weights = DefaultFitnessWeights, debug = false } = options;
  const intersectionMatrix = getIntersectionMatrix(pieces);
  const overlapArea = intersectionMatrix.sum() / 2;
  const usedLength = getUsedLength(pieces);
  const averageOrigin = getAverageOrigin(pieces);
  const packing = computePacking(pieces);
  if (debug) {
    console.log('getFitness:', weights);
    console.log('overlapArea:', overlapArea);
    console.log('usedLength:', usedLength);
    console.log('averageOrigin:', averageOrigin);
  }
  // we want to minimize both totalOverlapArea and usedLength
  const score =
    weights.overlap * overlapArea +
    weights.usedLength * usedLength +
    weights.averageColumn * averageOrigin.column +
    weights.averageRow * averageOrigin.row +
    weights.packing * (1 - packing); // we want to maximize packing
  return {
    overlapArea,
    usedLength,
    averageOrigin,
    packing,
    score,
  };
}
