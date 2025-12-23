import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../../src/extractPatternPieces.ts';
import { getRectangleFabric } from '../../src/getRectangleFabric.ts';
import { svgToIjs } from '../../src/svgToIjs.ts';
import { savePopulationImages } from '../../src/utils/savePopulationImages.ts';
import type { Orientation } from '../../src/PatternPiece.ts';
import { Gene } from '../../src/textileGA/Gene.ts';
import { getIntersection } from '../../src/utils/getIntersection.ts';
import { debug } from 'node:console';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };

const path = join(import.meta.dirname, '../../data/', img1);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: 10 });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
let pieces = extractPatternPieces(pattern, { debug: false });

pieces = [pieces[1], pieces[4]];

const origins = [
  { row: 74, column: 115 },
  { row: 21, column: 111 },
];
const orientations = [90, 180];

for (let i = 0; i < pieces.length; i++) {
  pieces[i].centerOrigin = origins[i];
  pieces[i].orientation = orientations[i] as Orientation;
}

const gene = new Gene(fabric, pieces);

savePopulationImages(fabric, [gene], {
  dirname: 'initialGene',
  path: import.meta.dirname,
  addText: true,
});

const overlap = getIntersection(pieces[0], pieces[1], true);

console.log(`Overlap: ${overlap} pixels`);
