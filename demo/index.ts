import { get } from 'node:http';
import { join } from 'node:path';

import { write } from 'image-js';

import type { PatternPieces } from '../src/PatternPiece.ts';
import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { Gene } from '../src/geneticAlgo/Gene.ts';
import { getDistanceMatrix } from '../src/geneticAlgo/getDistanceMatrix.ts';
import { getFitness } from '../src/geneticAlgo/getFitness.ts';
import { getGenesDistance } from '../src/geneticAlgo/getGenesDistance.ts';
import { getRandomPieces } from '../src/getRandomPieces.ts';
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
const populationSize = 10;
const initialPopulation: Gene[] = [];
for (let i = 0; i < populationSize; i++) {
  const randomPieces = getRandomPieces(fabric, pieces, {
    rotatePieces: true,
    seed: i,
  });
  const gene = new Gene(randomPieces);
  initialPopulation.push(gene);

  console.log(`Individual ${i} fitness: ${gene.fitness.score}`);
}

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
