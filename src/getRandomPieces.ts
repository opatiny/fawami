import type { Image } from 'image-js';
import { XSadd } from 'ml-xsadd';

import type { Orientation, PatternPieces } from './PatternPiece.ts';
import { PatternPiece } from './PatternPiece.ts';
import { getDefaultSeed } from './utils/getDefaultSeed.ts';
import { Random } from 'ml-random';

export interface GetRandomPiecesOptions {
  /**
   * Random generator to use
   * @default New random generator without seed
   */
  randomGen?: Random;
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
  const { randomGen = new Random(), rotatePieces = false } = options;

  const randomPieces: PatternPieces = [];
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;

    if (rotatePieces) {
      const orientations = [0, 90, 180, 270];
      const randIndex = Math.floor(randomGen.random() * orientations.length);
      piece.orientation = orientations[randIndex] as Orientation;
    }

    const rotatedCenter = piece.getRelativeCenter();

    const minX = rotatedCenter.column;
    const minY = rotatedCenter.row;
    const maxX = fabric.width - piece.getRotatedWidth() + rotatedCenter.column;
    const maxY = fabric.height - piece.getRotatedHeight() + rotatedCenter.row;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }

    const x = Math.floor(randomGen.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(randomGen.random() * (maxY - minY + 1)) + minY;
    const newPiece = PatternPiece.clone(piece);
    newPiece.centerOrigin = { row: y, column: x };
    randomPieces.push(newPiece);
  }
  return randomPieces;
}
