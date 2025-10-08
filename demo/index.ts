import { mkdir } from 'node:fs';
import { join } from 'node:path';

import { write, writeSync } from 'image-js';

import { extractRois } from '../src/extractRois.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { drawBoundingRectangles } from '../src/utils/drawBoundingRectangles.ts';
import { getColors } from '../src/utils/getColors.ts';

const img1 = 'shapes-holes.svg';
const img2 = 'freesewing-aaron.svg';

const path = join(import.meta.dirname, '../data/', img2);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path);

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const masks = extractRois(pattern, true);

console.log(`Extracted ${masks.length} pieces`);

// save each piece as a separate image
// create folder 'masks' first if it does not exist
mkdir(join(import.meta.dirname, 'masks'), { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

for (let i = 0; i < masks.length; i++) {
  const mask = masks[i];
  writeSync(join(import.meta.dirname, 'masks', `piece${i}.png`), mask);
}

// create a rectangular piece of fabric
const fabric = getRectangleFabric();

// crete array of colors
const colors = getColors(masks.length);
// paint pieces on the fabric
for (let i = 0; i < masks.length; i++) {
  const mask = masks[i];
  fabric.paintMask(mask, {
    origin: mask.origin,
    out: fabric,
    color: colors[i],
  });
}

await write(join(import.meta.dirname, 'fabric-with-parts.png'), fabric);

// draw bounding rectangles of each piece on the fabric
drawBoundingRectangles(fabric, masks);

await write(join(import.meta.dirname, 'fabric-with-BR.png'), fabric);
