import { mkdir } from 'node:fs';
import { join } from 'node:path';

import type { Image } from 'image-js';
import { writeSync } from 'image-js';

import type { PatternPieces } from '../PatternPiece.ts';

import { drawPieces } from './drawPieces.ts';

export interface SaveGenerationImagesOptions {
  /**
   * Output dfirectory, created if it does not exist.
   * @default 'sequences'
   */
  outdir?: string;

  /**
   * Path where the function is called.
   */
  path?: string;
}

/**
 * Save each pieces arrangement of the generation to an image.
 * @param fabric - Image on which to draw the pieces
 * @param sequences - Array of sequences of pieces to draw
 * @param options - Options for saving the images
 */
export function saveGenerationImages(
  fabric: Image,
  sequences: PatternPieces[],
  options: SaveGenerationImagesOptions = {},
): void {
  const { outdir = 'sequences', path = import.meta.dirname } = options;

  // create folder first if it does not exist
  mkdir(join(path, outdir), { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  for (let i = 0; i < sequences.length; i++) {
    const sequence = sequences[i] as PatternPieces;
    const fabricClone = fabric.clone();

    drawPieces(fabricClone, sequence);
    writeSync(join(path, outdir, `sequence${i}.png`), fabricClone);
  }
}
