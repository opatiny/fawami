import { mkdir } from 'node:fs';
import { join } from 'node:path';

import type { Image } from 'image-js';
import { add, writeSync } from 'image-js';

import type { Gene } from '../geneticAlgo/Gene.ts';

import { drawPieces } from './drawPieces.ts';
import { create } from 'node:domain';
import { createOrEmptyDir } from './createOrEmptyDir.ts';
import { drawText } from 'image-js/draw';

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
  /**
   * Add the sequence number on the image, as well as the score.
   * @default false
   */
  addText?: boolean;
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
    addText = false,
  } = options;

  if (addText && Math.max(fabric.width, fabric.height) < 50) {
    throw new Error(
      'Fabric too small to add numbers on images. Increase fabric size or disable addNumbers option.',
    );
  }

  const fullOutdir = join(path, dirname);

  createOrEmptyDir(fullOutdir);

  const nbDigits = Math.ceil(Math.log10(genes.length - 1));

  const numberPosition = { column: 10, row: fabric.height - 10 };

  const textSize = Math.max(Math.round(fabric.height / 30), 12);
  const scorePosition = {
    column: numberPosition.column,
    row: numberPosition.row - textSize - 5,
  };

  for (let i = 0; i < genes.length; i++) {
    const gene = genes[i] as Gene;
    let fabricClone = fabric.clone();

    drawPieces(fabricClone, gene.patternPieces);

    if (addText) {
      const textBaseOptions = {
        fontColor: [255, 255, 255],
        font: `${textSize}px Arial`,
      };

      fabricClone = drawText(fabricClone, {
        ...textBaseOptions,
        content: `score: ${gene.fitness.score.toFixed(3)}`,
        position: scorePosition,
      });
      fabricClone = drawText(fabricClone, {
        ...textBaseOptions,
        content: `#: ${i.toString().padStart(nbDigits, '0')}`,
        position: numberPosition,
      });
    }
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
