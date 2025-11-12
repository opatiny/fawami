import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';

import { drawBoundingRectangles } from './drawBoundingRectangles.ts';
import { getBlack } from './getBlack.ts';
import { getColors } from './getColors.ts';

export interface DrawRoisOptions {
  /**
   * Whether to show bounding rectangles around the masks
   * @default true
   */
  showBoundingRectangles?: boolean;
  /**
   * Whether to blend the masks colors.
   * @default true
   */
  blend?: boolean;
  /**
   * Enable debug?
   * @default false
   */
  debug?: boolean;
  backgroundColor?: number[];
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
    showBoundingRectangles = true,
    blend = true,
    debug = false,
    backgroundColor = getBlack(fabric),
  } = options;

  // fill fabric with background color
  fabric.fill(backgroundColor);

  // create array of colors
  const colors = getColors(pieces.length, fabric, { alpha: 200 });

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    if (debug) {
      console.log('piece origin', piece.centerOrigin);
    }
    const mask = piece.getRotatedMask();
    fabric.paintMask(mask, {
      origin: piece.getTopLeftOrigin(),
      out: fabric,
      color: colors[i],
      blend,
    });
  }

  if (showBoundingRectangles) {
    drawBoundingRectangles(fabric, pieces);
  }
}
