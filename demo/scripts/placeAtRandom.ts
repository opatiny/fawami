// example script that extracts the pattern pieces from an SVG file
// and places them randomly on a rectangular fabric

import { mkdir } from 'node:fs';
import { join } from 'node:path';

import { write, writeSync } from 'image-js';

import { extractPatternPieces } from '../../src/extractPatternPieces.ts';
import { getFitness } from '../../src/textileGA/getFitness.ts';
import { getRandomPieces } from '../../src/getRandomPieces.ts';
import { getRectangleFabric } from '../../src/getRectangleFabric.ts';
import { svgToIjs } from '../../src/svgToIjs.ts';
import { drawPieces } from '../../src/utils/drawPieces.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };

const path = join(import.meta.dirname, '../data/', img1);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path);

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

// save each piece as a separate image
// create folder 'masks' first if it does not exist
mkdir(join(import.meta.dirname, 'masks'), { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

for (let i = 0; i < pieces.length; i++) {
  const mask = pieces[i].mask;
  writeSync(join(import.meta.dirname, 'masks', `piece${i}.png`), mask);
}

// paint pieces on the fabric with default position
const fabricDefaultPos = fabric.clone();

drawPieces(fabricDefaultPos, pieces, { showBoundingRectangles: true });

await write(
  join(import.meta.dirname, 'fabric-with-original-parts.png'),
  fabricDefaultPos,
);

// place pieces randomly on the fabric, but use a seed
const fabricRandom = fabric.clone();
const randomPieces = getRandomPieces(fabricRandom, pieces, {
  rotatePieces: true,
});
drawPieces(fabricRandom, randomPieces, {
  showBoundingRectangles: true,
  blend: true,
});

await write(
  join(import.meta.dirname, 'fabric-with-random-parts.png'),
  fabricRandom,
);

// compute fitness value
const fitness = getFitness(fabricRandom, randomPieces, { debug: true });
console.log(`Fitness: ${fitness}`);
