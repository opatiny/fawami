import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import type { Gene } from '../src/geneticAlgo/Gene.ts';
import { crossover1Point } from '../src/geneticAlgo/crossover1point.ts';
import { getDistanceMatrix } from '../src/geneticAlgo/getDistanceMatrix.ts';
import { getGenesDistance } from '../src/geneticAlgo/getGenesDistance.ts';
import { getRandomGenes } from '../src/geneticAlgo/getRandomGenes.ts';
import { mutateAndKeepBest } from '../src/geneticAlgo/mutateAndKeepBest.ts';
import { mutateTranslate } from '../src/geneticAlgo/mutateTranslate.ts';
import { sortGenesByScore } from '../src/geneticAlgo/sortGenesByScore.ts';
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

const gene1 = initialPopulation[0] as Gene;

// mutate a gene multiple times and select the best ones
const bestMutants = mutateAndKeepBest(fabric, gene1, {
  populationSize: 10,
  nbIterations: 100,
  debug: true,
});

savePopulationImages(fabric, bestMutants, {
  outdir: 'sortedMutants',
  path: import.meta.dirname,
  nameBase: 'generation',
});
