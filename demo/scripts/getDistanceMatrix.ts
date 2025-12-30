// example script that extracts the pattern pieces from an SVG file,
// creates an initial population of genes for a genetic algorithm,
// and computes a distance matrix between the genes

import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../../src/imageProcessing/extractPatternPieces.ts';
import { getDistanceMatrix } from '../../src/textileGA/utils/getDistanceMatrix.ts';
import { getGenesDistance } from '../../src/textileGA/utils/getGenesDistance.ts';
import { getRandomGenes } from '../../src/textileGA/getRandomGenes.ts';
import { getRectangleFabric } from '../../src/utils/getRectangleFabric.ts';
import { svgToIjs } from '../../src/imageProcessing/svgToIjs.ts';
import { savePopulationImages } from '../../src/utils/savePopulationImages.ts';
import { Random } from 'ml-random';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };

const path = join(import.meta.dirname, '../data/', img1);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path);

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

// create initial generation for genetic algorithm
const initialPopulation = getRandomGenes(fabric, pieces, {
  populationSize: 10,
  randomGen: new Random(0),
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
