import type { Image } from 'image-js';
import { XSadd } from 'ml-xsadd';

import type { Orientation, PatternPieces } from './PatternPiece.ts';
import { PatternPiece } from './PatternPiece.ts';

export interface GetRandomPiecesOptions {
  /**
   * Seed for the random number generator. By default, there is no seed.
   * @default undefined
   */
  seed?: number;
  /**
   * Whether to rotate pieces randomly.
   * @default false
   */
  rotatePieces?: boolean;
}

/**
 * Create new array of pieces with random origins and orientations. All pieces will fit within the fabric.
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
  const { seed = (Math.random() * 2 ** 32) >> 0, rotatePieces = false } =
    options;

  const xsadd = new XSadd(seed);

  const randomPieces: PatternPieces = [];
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;

    if (rotatePieces) {
      const orientations = [0, 90, 180, 270];
      const randIndex = Math.floor(xsadd.getFloat() * orientations.length);
      piece.orientation = orientations[randIndex] as Orientation;
    }

    const rotatedCenter = PatternPiece.getRotatedCenter(piece);

    const minX = rotatedCenter.column;
    const minY = rotatedCenter.row;
    const maxX =
      fabric.width - PatternPiece.getRotatedWidth(piece) + rotatedCenter.column;
    const maxY =
      fabric.height - PatternPiece.getRotatedHeight(piece) + rotatedCenter.row;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }

    const x = Math.floor(xsadd.getFloat() * (maxX - minX + 1)) + minX;
    const y = Math.floor(xsadd.getFloat() * (maxY - minY + 1)) + minY;
    const newPiece = PatternPiece.clone(piece);
    newPiece.centerOrigin = { row: y, column: x };
    randomPieces.push(newPiece);
  }
  return randomPieces;
}
