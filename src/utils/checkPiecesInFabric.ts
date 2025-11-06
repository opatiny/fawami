import type { Image } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';
import { PatternPiece } from '../PatternPiece.ts';

/**
 * Check if all pieces are within the fabric boundaries given their location and orientation.
 * @param fabric - The fabric image
 * @param pieces - The pieces to check
 * @param debug - Enable debug?
 * @returns True if all pieces are within the fabric boundaries, false otherwise
 */
export function checkPiecesInFabric(
  fabric: Image,
  pieces: PatternPieces,
  debug = false,
): boolean {
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;

    const topLeftOrigin = PatternPiece.getTopLeftOrigin(piece);
    const rotatedWidth = PatternPiece.getRotatedWidth(piece);
    const rotatedHeight = PatternPiece.getRotatedHeight(piece);
    if (
      topLeftOrigin.column < 0 ||
      topLeftOrigin.row < 0 ||
      topLeftOrigin.column + rotatedWidth > fabric.width ||
      topLeftOrigin.row + rotatedHeight > fabric.height
    ) {
      if (debug) {
        console.log('Piece', i, 'is out of fabric bounds');
      }
      return false;
    }
  }
  return true;
}
