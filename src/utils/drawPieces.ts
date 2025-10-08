import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';

import { drawBoundingRectangles } from './drawBoundingRectangles.ts';
import { getColors } from './getColors.ts';

export interface DrawRoisOptions {
  /**
   * Whether to show bounding rectangles around the masks
   * @default false
   */
  showBoundingRectangles?: boolean;
  /**
   * Whether to blend the masks colors.
   * @default false
   */
  blend?: boolean;
  /**
   * Enable debug?
   * @default false
   */
  debug?: boolean;
}

/**
 * Draw the bounding rectangles of the masks on the fabric.
 * @param fabric - The fabric image
 * @param pieces - The pieces to draw
 * @param options - Options for drawing masks
 */
export function drawPieces(
  fabric: Image,
  pieces: PatternPiece[],
  options: DrawRoisOptions = {},
): void {
  const {
    showBoundingRectangles = false,
    blend = false,
    debug = false,
  } = options;

  // create array of colors
  const colors = getColors(pieces.length, fabric);

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    if (debug) {
      console.log('piece origin', piece.origin);
    }
    const mask = piece.mask;
    fabric.paintMask(mask, {
      origin: piece.origin,
      out: fabric,
      color: colors[i],
      blend,
    });
  }

  if (showBoundingRectangles) {
    drawBoundingRectangles(fabric, pieces);
  }
}
