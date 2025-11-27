import type { Image } from 'image-js';
import { XSadd } from 'ml-xsadd';

import { PatternPiece } from '../PatternPiece.ts';
import { clampPiecesPosition } from '../utils/clampPiecesPosition.ts';
import { getDefaultSeed } from '../utils/getDefaultSeed.ts';

import { Gene } from './Gene.ts';

export interface MutateOptions {
  /**
   * Amplitude of the translation in pixels.
   * @default 10
   */
  translationAmplitude?: number;
}

export const DefaultMutateOptions: MutateOptions = {
  translationAmplitude: 10,
};

export interface MutateTranslateOptions extends MutateOptions {
  /**
   * Seed for the random number generator.
   * @default A random seed
   */
  seed?: number;
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
    seed = getDefaultSeed(),
    debug = false,
  } = options;

  // clone pattern pieces
  const newPieces = [];
  for (const piece of gene.patternPieces) {
    const newPiece = PatternPiece.clone(piece);
    newPieces.push(newPiece);
  }

  const xsadd = new XSadd(seed);

  for (const piece of newPieces) {
    const rowOffset =
      getRandomOffsetDirection(xsadd.getUint32()) * translationAmplitude;
    // todo: is this a correct way to get different random values?
    const columnOffset =
      getRandomOffsetDirection(xsadd.getUint32()) * translationAmplitude;

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

  return new Gene(newPieces);
}

function getRandomOffsetDirection(seed?: number): number {
  if (seed === undefined) {
    seed = getDefaultSeed();
  }
  const xsadd = new XSadd(seed);

  const values = [-1, 0, 1];
  const index = Math.floor(xsadd.getFloat() * values.length);
  return values[index];
}
