import type { Image } from 'image-js';

import { PatternPiece } from '../PatternPiece.ts';
import { clampPiecesPosition } from '../utils/clampPiecesPosition.ts';

import { Gene } from './Gene.ts';
import { Random } from 'ml-random';
import { modifyOverlapMatrix } from '../utils/modifyOverlapMatrix.ts';

export interface MutateOptions {
  /**
   * Amplitude of the translation in pixels.
   * @default 10
   */
  translationAmplitude?: number;
  /**
   * Number of iterations (generations) to compute)
   * @default 5
   */
  nbIterations?: number;
  /**
   * Pick mutation function
   * @default 'smart'
   */
  mutationFunction?: 'mutateAndKeepBest' | 'smart';
  /**
   * Whether to push the pieces to top-left before starting mutation
   * @default false
   */
  pushTopLeft?: boolean;
}

export const DefaultMutateOptions: MutateOptions = {
  translationAmplitude: 10,
  mutationFunction: 'smart',
  nbIterations: 5,
  pushTopLeft: false,
};

export interface MutateTranslateOptions extends MutateOptions {
  /**
   * Random generator
   * @default New random generator without seed
   */
  randomGen?: Random;
  /**
   * Enable debug?
   * @default false
   */
  debug?: boolean;
}

/**
 * Mutate the positions of the pattern pieces by translating them randomly of a fixed amplitude. The row and column can be moved by -amplitude, 0 or +amplitude.
 * Clamp the positions to ensure they stay within the fabric boundaries.
 * @param fabric - The fabric image
 * @param gene - The pattern pieces to mutate
 * @param options - Options for mutation
 * @returns New array of mutated pattern pieces
 */
export function mutateTranslate(
  fabric: Image,
  gene: Gene,
  options: MutateTranslateOptions = {},
): Gene {
  const {
    // the ! is the non-null assertion operator
    translationAmplitude = DefaultMutateOptions.translationAmplitude!,
    randomGen = new Random(),
    debug = false,
  } = options;

  // clone pattern pieces
  const newPieces = [];
  for (const piece of gene.patternPieces) {
    const newPiece = PatternPiece.clone(piece);
    newPieces.push(newPiece);
  }

  // clone overlap matrix
  const matrix = gene.overlapMatrix.clone();

  const nbPieces = newPieces.length;

  for (let i = 0; i < nbPieces; i++) {
    const rowOffset =
      getRandomOffsetDirection(randomGen) * translationAmplitude;
    // todo: is this a correct way to get different random values?
    const columnOffset =
      getRandomOffsetDirection(randomGen) * translationAmplitude;

    if (debug) {
      console.log(
        `mutateTranslate: rowOffset=${rowOffset}, columnOffset=${columnOffset}`,
      );
    }

    newPieces[i].centerOrigin = {
      row: newPieces[i].centerOrigin.row + rowOffset,
      column: newPieces[i].centerOrigin.column + columnOffset,
    };

    // set matrix entries to -1 if piece is moved
    if (rowOffset !== 0 || columnOffset !== 0) {
      modifyOverlapMatrix(matrix, i);
    }
  }
  clampPiecesPosition(fabric, newPieces);

  return new Gene(gene.fabric, newPieces, {
    fitnessWeights: gene.fitnessWeights,
    overlapMatrix: matrix,
  });
}

function getRandomOffsetDirection(randomGen: Random = new Random()): number {
  const values = [-1, 0, 1];
  const index = Math.floor(randomGen.random() * values.length);
  return values[index];
}
