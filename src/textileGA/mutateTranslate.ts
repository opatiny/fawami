import type { Image } from 'image-js';

import { PatternPiece } from '../PatternPiece.ts';
import { clampPiecesPosition } from '../utils/clampPiecesPosition.ts';

import { Gene } from './Gene.ts';
import { Random } from 'ml-random';

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
}

export const DefaultMutateOptions: MutateOptions = {
  translationAmplitude: 10,
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

  for (const piece of newPieces) {
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

    piece.centerOrigin = {
      row: piece.centerOrigin.row + rowOffset,
      column: piece.centerOrigin.column + columnOffset,
    };
  }
  clampPiecesPosition(fabric, newPieces);

  return new Gene(gene.fabric, newPieces, {
    fitnessWeights: gene.fitnessWeights,
  });
}

function getRandomOffsetDirection(randomGen: Random = new Random()): number {
  const values = [-1, 0, 1];
  const index = Math.floor(randomGen.random() * values.length);
  return values[index];
}
