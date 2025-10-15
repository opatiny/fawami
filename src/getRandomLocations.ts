import type { Image } from 'image-js';

import type { PatternPieces } from './PatternPiece.ts';
import { PatternPiece } from './PatternPiece.ts';

/**
 * Create new array of pieces with random origins on the fabric.
 * @param fabric - The fabric on which to place the ROIs
 * @param pieces - The ROIs to place on the fabric
 * @returns New array of pieces with updated origins
 */
export function getRandomLocations(
  fabric: Image,
  pieces: PatternPieces,
): PatternPieces {
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

    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    const newPiece = PatternPiece.clone(piece);
    newPiece.origin = { row: y, column: x };
    randomPieces.push(newPiece);
  }
  return randomPieces;
}
