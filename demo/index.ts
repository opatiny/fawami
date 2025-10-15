import { mkdir } from 'node:fs';
import { join } from 'node:path';

import { write, writeSync } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { getFitness } from '../src/getFitness.ts';
import { getRandomLocations } from '../src/getRandomLocations.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { drawPieces } from '../src/utils/drawPieces.ts';
import { getIntersection } from '../src/utils/getIntersection.ts';
import { getIntersectionMatrix } from '../src/utils/getIntersectionMatrix.ts';
import { getUsedLength } from '../src/utils/getUsedLength.ts';
import { getInt16Array } from '../test/testUtils.ts';

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
const pieces = extractPatternPieces(pattern, true);

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

// place pieces randomly on the fabric
const fabricRandom = fabric.clone();
const locations = getRandomLocations(fabricRandom, pieces);
drawPieces(fabricRandom, pieces, {
  locations,
  showBoundingRectangles: true,
  blend: true,
});

await write(
  join(import.meta.dirname, 'fabric-with-random-parts.png'),
  fabricRandom,
);

// compute overlap area and used length

const overlap = getIntersectionMatrix(pieces, locations).sum() / 2;

const length = getUsedLength(pieces);

console.log(`Overlap area: ${overlap} pixels`);
console.log(`Length of fabric used: ${length} pixels`);

// compute fitness value
const fitness = getFitness(pieces, locations);
console.log(`Fitness: ${fitness}`);
