import { mkdir } from 'node:fs';
import { join } from 'node:path';

import fsExtra from 'fs-extra';
import type { Image } from 'image-js';
import { writeSync } from 'image-js';

import type { Gene } from '../geneticAlgo/Gene.ts';

import { drawPieces } from './drawPieces.ts';

export interface SavePopulationImagesOptions {
  /**
   * Output directory name, created if it does not exist.
   * @default 'sequences'
   */
  dirname?: string;
  /**
   * Path where to create the output directory.
   * @default import.meta.dirname
   */
  path?: string;
  /**
   * Base name for saved images.
   * @default 'sequence'
   */
  nameBase?: string;
}

/**
 * Save each pieces arrangement of the generation to an image.
 * @param fabric - Image on which to draw the pieces
 * @param genes - Array of sequences of pieces to draw
 * @param options - Options for saving the images
 */
export function savePopulationImages(
  fabric: Image,
  genes: Gene[],
  options: SavePopulationImagesOptions = {},
): void {
  const {
    dirname = 'sequences',
    path = import.meta.dirname,
    nameBase = 'sequence',
  } = options;

  const fullOutdir = join(path, dirname);

  // create folder first if it does not exist
  mkdir(fullOutdir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  // empty output directory
  fsExtra.emptyDirSync(fullOutdir);

  const nbDigits = Math.ceil(Math.log10(genes.length - 1));

  for (let i = 0; i < genes.length; i++) {
    const gene = genes[i] as Gene;
    const fabricClone = fabric.clone();

    drawPieces(fabricClone, gene.patternPieces);
    writeSync(
      join(
        path,
        dirname,
        `${nameBase}${i.toString().padStart(nbDigits, '0')}.png`,
      ),
      fabricClone,
    );
  }
}
