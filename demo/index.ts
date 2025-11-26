import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { getDistantGenes } from '../src/geneticAlgo/getDistantGenes.ts';
import { getRandomGenes } from '../src/geneticAlgo/getRandomGenes.ts';
import { mutateAndKeepBest } from '../src/geneticAlgo/mutateAndKeepBest.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { savePopulationImages } from '../src/utils/savePopulationImages.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };

const path = join(import.meta.dirname, '../data/', img2);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim2);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: 10 });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

// create initial generation for genetic algorithm
const initialPopulation = getRandomGenes(fabric, pieces, {
  populationSize: 10,
  seedRandomGenerator: true,
  rotatePieces: true,
});

// save all sequences to images
savePopulationImages(fabric, initialPopulation, { path: import.meta.dirname });

const gene1 = initialPopulation[0];

// mutate a gene multiple times and select the best ones
const bestMutants = mutateAndKeepBest(fabric, gene1, {
  populationSize: 10,
  nbIterations: 100,
  debug: false,
});

savePopulationImages(fabric, bestMutants, {
  outdir: 'sortedMutants',
  path: import.meta.dirname,
  nameBase: 'generation',
});

// test getDistantGenes
const distantGenes = getDistantGenes(bestMutants, {
  numberOfGenes: 5,
  debug: false,
});
