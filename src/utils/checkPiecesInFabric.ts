import type { Image } from 'image-js';

import type { PatternPiece, PatternPieces } from '../PatternPiece.ts';

/**
 * Check if all pieces are within the fabric boundaries given their locations.
 * @param fabric - The fabric image
 * @param pieces - The pieces to check
 * @returns True if all pieces are within the fabric boundaries, false otherwise
 */
export function checkPiecesInFabric(
  fabric: Image,
  pieces: PatternPieces,
): boolean {
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    if (
      piece.origin.column < 0 ||
      piece.origin.row < 0 ||
      piece.origin.column + piece.meta.width > fabric.width ||
      piece.origin.row + piece.meta.height > fabric.height
    ) {
      console.log('Piece', i, 'is out of fabric bounds');
      return false;
    }
  }
  return true;
}
