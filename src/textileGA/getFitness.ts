import type { Image, Point } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';
import { getAverageOrigin } from '../utils/getAverageOrigin.ts';
import { getIntersectionMatrix } from '../utils/getIntersectionMatrix.ts';
import { getUsedLength } from '../utils/getUsedLength.ts';
import { computePacking } from '../utils/computePacking.ts';
import { Matrix } from 'ml-matrix';
import { updateOverlapMatrix } from '../utils/updateOverlapMatrix.ts';

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
   * Normalized overlapping area between pieces
   */
  overlapArea: number;
  /**
   * Normalized length of fabric used
   */
  usedLength: number;
  /**
   * Normalized average origin of the pattern pieces. More powerful than usedLength because usedLength only puts the pressure on the right-most piece.
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
 * All of these parameters are normalized between 0 and 1.
 * Lower fitness is better.
 * @param pieces - Array of pattern pieces
 * @param options - Options for computing fitness
 * @returns The fitness value
 */
export function getFitness(
  fabric: Image,
  pieces: PatternPieces,
  overlapMatrix: Matrix,
  options: GetFitnessOptions = {},
): FitnessData {
  const { weights = DefaultFitnessWeights, debug = false } = options;
  // update overlap matrix of the gene (in place)
  updateOverlapMatrix(overlapMatrix, pieces);

  const overlapArea = overlapMatrix.sum() / 2;
  const usedLength = getUsedLength(pieces);
  const averageOrigin = getAverageOrigin(pieces);
  const packing = computePacking(pieces);

  // normalize values
  const normalizedUsedLength = usedLength / fabric.width;
  const normalizedAverageOrigin: Point = {
    column: averageOrigin.column / fabric.width,
    row: averageOrigin.row / fabric.height,
  };
  // easy way of having the overlap with the right order of magnitude
  // can be larger than 1
  const maxOverlapArea = fabric.width * fabric.height;
  const normalizedOverlapArea = overlapArea / maxOverlapArea;

  if (debug) {
    console.log('getFitness:', weights);
    console.log('normalized overlapArea:', overlapArea);
    console.log('normalized usedLength:', normalizedUsedLength);
    console.log('normalized averageOrigin:', normalizedAverageOrigin);
    console.log('packing:', packing);
  }
  // we want to minimize both totalOverlapArea and usedLength
  const score =
    weights.overlap * normalizedOverlapArea +
    weights.usedLength * normalizedUsedLength +
    weights.averageColumn * normalizedAverageOrigin.column +
    weights.averageRow * normalizedAverageOrigin.row +
    weights.packing * (1 - packing); // we want to maximize packing

  return {
    overlapArea: normalizedOverlapArea,
    usedLength: normalizedUsedLength,
    averageOrigin: normalizedAverageOrigin,
    packing,
    score,
  };
}
