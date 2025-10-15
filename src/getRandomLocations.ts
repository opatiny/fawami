import type { Image } from 'image-js';

import type { PatternPiece } from './PatternPiece.ts';
import type { PiecesLocations } from './PiecesLocations.ts';

/**
 * Compute random positions for the masks within the fabric.
 * @param fabric - The fabric on which to place the ROIs
 * @param pieces - The ROIs to place on the fabric
 * @returns The locations of the pieces
 */
export function getRandomLocations(
  fabric: Image,
  pieces: PatternPiece[],
): PiecesLocations {
  const minX = 0;
  const minY = 0;

  const locations: PiecesLocations = [];
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    const maxX = fabric.width - piece.width;
    const maxY = fabric.height - piece.height;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }

    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    locations.push({
      origin: { row: y, column: x },
      orientation: piece.orientation,
    });
  }
  return locations;
}
