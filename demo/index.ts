import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { crossover1Point } from '../src/geneticAlgo/crossover1point.ts';
import { getDistanceMatrix } from '../src/geneticAlgo/getDistanceMatrix.ts';
import { getGenesDistance } from '../src/geneticAlgo/getGenesDistance.ts';
import { getRandomGenes } from '../src/geneticAlgo/getRandomGenes.ts';
import { mutateTranslate } from '../src/geneticAlgo/mutateTranslate.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { savePopulationImages } from '../src/utils/savePopulationImages.ts';

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

// create initial generation for genetic algorithm
const initialPopulation = getRandomGenes(fabric, pieces, {
  populationSize: 10,
  seedRandomGenerator: true,
  rotatePieces: true,
});

// save all sequences to images
savePopulationImages(fabric, initialPopulation, { path: import.meta.dirname });

// compute distaces between first two individuals
const distance = getGenesDistance(initialPopulation[0], initialPopulation[1], {
  debug: true,
});
console.log(`Distance between individual 0 and 1: ${distance}`);

// compute distance matrix
const distanceMatrix = getDistanceMatrix(initialPopulation);
console.log('Distance matrix:');
console.log(distanceMatrix.toString());

// test 1 point crossover between the two first genes
const children = crossover1Point(initialPopulation[0], initialPopulation[1], {
  debug: true,
});

savePopulationImages(fabric, children, {
  outdir: 'children',
  path: import.meta.dirname,
});

// test mutate translate
const mutated = mutateTranslate(fabric, initialPopulation[0], {
  debug: true,
  translationAmplitude: 10,
});
savePopulationImages(fabric, [mutated], {
  outdir: 'mutated',
  path: import.meta.dirname,
});
