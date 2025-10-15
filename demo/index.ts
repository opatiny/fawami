import { mkdir } from 'node:fs';
import { join } from 'node:path';

import { write, writeSync } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { placeRandomOnFabric } from '../src/placeRandomOnFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { drawPieces } from '../src/utils/drawPieces.ts';

const img1 = 'shapes-holes.svg';
const img2 = 'freesewing-aaron.svg';

const path = join(import.meta.dirname, '../data/', img1);

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

// create a rectangular piece of fabric
const fabric = getRectangleFabric({ width: 20, length: 30 });

// paint pieces on the fabric with default position
const fabricDefaultPos = fabric.clone();

drawPieces(fabricDefaultPos, pieces, { showBoundingRectangles: true });

await write(
  join(import.meta.dirname, 'fabric-with-original-parts.png'),
  fabricDefaultPos,
);

// place pieces randomly on the fabric
const fabricRandom = fabric.clone();
const locations = placeRandomOnFabric(fabricRandom, pieces);
drawPieces(fabricRandom, pieces, {
  locations,
  showBoundingRectangles: true,
  blend: true,
});

await write(
  join(import.meta.dirname, 'fabric-with-random-parts.png'),
  fabricRandom,
);
