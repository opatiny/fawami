import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { getDistantGenes } from '../src/geneticAlgo/getDistantGenes.ts';
import { getRandomGenes } from '../src/geneticAlgo/getRandomGenes.ts';
import { mutateAndKeepBest } from '../src/geneticAlgo/mutateAndKeepBest.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { savePopulationImages } from '../src/utils/savePopulationImages.ts';
import { TextileGA } from '../src/geneticAlgo/TextileGA.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };

const path = join(import.meta.dirname, '../data/', img2);

const currentDir = import.meta.dirname;

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim2);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: 10 });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

const textileOptimizer = new TextileGA(fabric, pieces, {
  seed: 0,
  optionsGA: {
    populationSize: 10,
    nbDiverseIndividuals: 0,
    enableMutation: false,
    enableCrossover: true,
  },
  crossoverOptions: { minCrossoverFraction: 0.2 },
});

textileOptimizer.savePopulationImages({
  path: currentDir,
  outdir: `population-iteration0`,
});

textileOptimizer.plotDistanceHeatmap({
  path: currentDir,
  debug: true,
  name: 'heatmap-iteration0.svg',
});

const nbIterations = 5;
for (let i = 1; i <= nbIterations; i++) {
  console.log(`\n--- Iteration ${i} ---`);

  textileOptimizer.ga.computeNextGeneration();

  textileOptimizer.savePopulationImages({
    path: currentDir,
    outdir: `population-iteration${i}`,
  });

  textileOptimizer.plotDistanceHeatmap({
    path: currentDir,
    debug: false,
    name: `heatmap-iteration${i}.svg`,
  });
  console.log('New best score: ', textileOptimizer.getBestScores()[0]);
}
