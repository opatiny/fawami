import type { Image, Roi } from 'image-js';

import type { PatternPiece } from './PatternPiece.ts';

/**
 * Redefine origins of masks to random positions within the fabric (in place).
 * @param fabric - The fabric on which to place the ROIs
 * @param pieces - The ROIs to place on the fabric
 */
export function placeRandomOnFabric(
  fabric: Image,
  pieces: PatternPiece[],
): void {
  const minX = 0;
  const minY = 0;
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    const maxX = fabric.width - piece.width;
    const maxY = fabric.height - piece.height;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }

    console.log('old origin', piece.origin);

    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    piece.origin = { column: x, row: y };
    console.log('new origin', piece.origin);
  }
}
