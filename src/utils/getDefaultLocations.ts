import type { PatternPiece } from '../PatternPiece.ts';
import type { PiecesLocations } from '../PiecesLocations.ts';

/**
 * Get the default locations of the pieces based on their origin and orientation.
 * @param pieces - The pieces to get the locations for
 * @returns The locations of the pieces
 */
export function getDefaultLocations(pieces: PatternPiece[]): PiecesLocations {
  return pieces.map((piece) => ({
    origin: piece.origin,
    orientation: piece.orientation,
  }));
}
