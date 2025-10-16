import type { Image } from 'image-js';
import { XSadd } from 'ml-xsadd';

import type { PatternPieces } from './PatternPiece.ts';
import { PatternPiece } from './PatternPiece.ts';

export interface GetRandomPiecesOptions {
  /**
   * Seed for the random number generator. By default, there is no seed.
   * @default undefined
   */
  seed?: number | undefined;
}

/**
 * Create new array of pieces with random origins on the fabric.
 * @param fabric - The fabric on which to place the ROIs
 * @param pieces - The ROIs to place on the fabric
 * @param options - Options for placing the pieces
 * @returns New array of pieces with updated origins
 */
export function getRandomPieces(
  fabric: Image,
  pieces: PatternPieces,
  options: GetRandomPiecesOptions = {},
): PatternPieces {
  const { seed = undefined } = options;

  let xsadd;

  if (seed !== undefined) {
    xsadd = new XSadd(seed);
  } else {
    xsadd = new XSadd();
  }

  const minX = 0;
  const minY = 0;

  const randomPieces: PatternPieces = [];
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    const maxX = fabric.width - piece.meta.width;
    const maxY = fabric.height - piece.meta.height;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }

    const x = Math.floor(xsadd.getFloat() * (maxX - minX + 1)) + minX;
    const y = Math.floor(xsadd.getFloat() * (maxY - minY + 1)) + minY;
    const newPiece = PatternPiece.clone(piece);
    newPiece.origin = { row: y, column: x };
    randomPieces.push(newPiece);
  }
  return randomPieces;
}
