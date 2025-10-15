import { get } from 'node:http';

import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';
import type { PiecesLocations } from '../PiecesLocations.ts';

import { drawBoundingRectangles } from './drawBoundingRectangles.ts';
import { getColors } from './getColors.ts';
import { getDefaultLocations } from './getDefaultLocations.ts';

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
  locations?: PiecesLocations;
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
    locations = getDefaultLocations(pieces),
  } = options;

  if (pieces.length !== locations.length) {
    throw new Error(
      'drawPieces: Number of pieces and number of locations must be equal',
    );
  }

  // create array of colors
  const colors = getColors(pieces.length, fabric, { alpha: 200 });

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i] as PatternPiece;
    if (debug) {
      console.log('piece origin', piece.origin);
    }
    const mask = piece.mask;
    fabric.paintMask(mask, {
      origin: locations[i].origin,
      out: fabric,
      color: colors[i],
      blend,
    });
  }

  if (showBoundingRectangles) {
    drawBoundingRectangles(fabric, pieces, { locations });
  }
}
