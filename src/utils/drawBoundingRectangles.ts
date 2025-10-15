import type { Image } from 'image-js';

import type { PatternPiece } from '../PatternPiece.ts';
import type { PiecesLocations } from '../PiecesLocations.ts';

import { getDefaultLocations } from './getDefaultLocations.ts';

export interface DrawBoundingRectanglesOptions {
  /**
   * Specify the locations of the pieces
   */
  locations?: PiecesLocations;
}

/**
 * Draw the bounding rectangles of the masks on the fabric.
 * @param fabric - The fabric image
 * @param pieces - The pieces to draw
 * @param options
 */
export function drawBoundingRectangles(
  fabric: Image,
  pieces: PatternPiece[],
  options: DrawBoundingRectanglesOptions = {},
): void {
  const { locations = getDefaultLocations(pieces) } = options;

  if (pieces.length !== locations.length) {
    throw new Error(
      'drawBoundingRectangles: Number of pieces and number of locations must be equal',
    );
  }

  const color = new Array(fabric.channels).fill(fabric.maxValue);
  for (let i = 0; i < pieces.length; i++) {
    fabric.drawRectangle({
      origin: locations[i].origin,
      width: pieces[i].width,
      height: pieces[i].height,
      strokeColor: color,
      out: fabric,
    });
  }
}
