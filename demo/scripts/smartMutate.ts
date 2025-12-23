import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../../src/extractPatternPieces.ts';
import { getRandomGenes } from '../../src/textileGA/getRandomGenes.ts';
import { getRectangleFabric } from '../../src/getRectangleFabric.ts';
import { svgToIjs } from '../../src/svgToIjs.ts';
import { savePopulationImages } from '../../src/utils/savePopulationImages.ts';
import { Random } from 'ml-random';
import { smartMutate } from '../../src/textileGA/smartMutate.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };

const path = join(import.meta.dirname, '../../data/', img1);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: 10 });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

const randomGen = new Random(0);

// create initial generation for genetic algorithm
const initialPopulation = getRandomGenes(fabric, pieces, {
  populationSize: 5,
  randomGen: randomGen,
  rotatePieces: true,
  fitnessWeights: {
    averageColumn: 1,
    averageRow: 1,
    packing: 0,
    overlap: 1000,
    usedLength: 0,
  },
});

// save all sequences to images
savePopulationImages(fabric, initialPopulation, {
  path: import.meta.dirname,
  dirname: 'initialPopulation',
  addText: true,
});

// mutate a gene multiple times and select the best ones
const mutants = initialPopulation.map((gene) =>
  smartMutate(fabric, gene, {
    translationAmplitude: 1,
    nbIterations: 10,
    debug: 1,
  }),
);

savePopulationImages(fabric, mutants, {
  dirname: 'smartMutants',
  path: import.meta.dirname,
  addText: true,
});
