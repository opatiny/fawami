import type { Image } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';

/**
 * Clamps the positions of the pieces to ensure they stay within the fabric boundaries.
 * @param fabric - The fabric image
 * @param pieces - The pattern pieces to place on the fabric
 */
export function clampPiecesPosition(
  fabric: Image,
  pieces: PatternPieces,
): void {
  for (const piece of pieces) {
    const topLeftOrigin = piece.getTopLeftOrigin();
    const rotatedWidth = piece.getRotatedWidth();
    const rotatedHeight = piece.getRotatedHeight();

    if (rotatedWidth > fabric.width || rotatedHeight > fabric.height) {
      throw new Error(
        `clampPiecePosition: Piece is larger than fabric. Piece size: ${rotatedWidth}x${rotatedHeight}, Fabric size: ${fabric.width}x${fabric.height}`,
      );
    }

    // clamp column
    if (topLeftOrigin.column < 0) {
      topLeftOrigin.column = 0;
    } else if (topLeftOrigin.column + rotatedWidth > fabric.width) {
      topLeftOrigin.column = fabric.width - rotatedWidth;
    }

    // clamp row
    if (topLeftOrigin.row < 0) {
      topLeftOrigin.row = 0;
    } else if (topLeftOrigin.row + rotatedHeight > fabric.height) {
      topLeftOrigin.row = fabric.height - rotatedHeight;
    }

    const newCenterOrigin = {
      row: topLeftOrigin.row + piece.getRelativeCenter().row,
      column: topLeftOrigin.column + piece.getRelativeCenter().column,
    };

    piece.centerOrigin = newCenterOrigin;
  }
}
