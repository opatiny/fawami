import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';
import type { PieceLocation, PiecesLocations } from '../PiecesLocations.ts';

/**
 * Check if all pieces are within the fabric boundaries given their locations.
 * @param fabric - The fabric image
 * @param pieces - The pieces to check
 * @param locations - The locations of the pieces on the fabric
 * @returns True if all pieces are within the fabric boundaries, false otherwise
 */
export function checkPiecesInFabric(
  fabric: Image,
  pieces: PatternPiece[],
  locations: PiecesLocations,
): boolean {
  if (pieces.length !== locations.length) {
    throw new Error(
      'checkPiecesInFabric: Number of pieces and number of locations must be equal',
    );
  }
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    const location = locations[i] as PieceLocation;
    if (
      location.origin.column < 0 ||
      location.origin.row < 0 ||
      location.origin.column + piece.width > fabric.width ||
      location.origin.row + piece.height > fabric.height
    ) {
      console.log('Piece', i, 'is out of fabric bounds');
      return false;
    }
  }
  return true;
}
