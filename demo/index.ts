import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/imageProcessing/extractPatternPieces.ts';
import { getRectangleFabric } from '../src/utils/getRectangleFabric.ts';
import { svgToIjs } from '../src/imageProcessing/svgToIjs.ts';
import { TextileGA } from '../src/textileGA/TextileGA.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };
const img3 = 'circles.svg';
const dim3 = { width: 30, length: 20 };

const path = join(import.meta.dirname, '../data/', img1);

const currentDir = import.meta.dirname;

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: 10 });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, { debug: true });

console.log(`Extracted ${pieces.length} pieces`);

const textileOptimizer = new TextileGA(fabric, pieces, {
  // seed: 100,
  nbCuts: 1,
  enableRotation: true,
  optionsGA: {
    initialPopulationSize: 10,
    populationSize: 10,
    eliteSize: 3,
    enableMutation: true,
    enableCrossover: true,
    nextGenFunction: 'smart',
  },
  crossoverOptions: { minCrossoverFraction: 0.4 },
  mutateOptions: {
    translationAmplitude: 2,
    mutationFunction: 'smart',
    nbIterations: 15,
    pushTopLeft: true,
  },
  distanceOptions: { centerWeight: 1, orientationWeight: 100 },
  fitnessWeights: {
    averageColumn: 1,
    averageRow: 1,
    overlap: 1000,
    usedLength: 0,
    packing: 1,
  },
  path: currentDir,
});

textileOptimizer.saveConfig();

textileOptimizer.savePopulationImages({
  dirname: `population-iteration0`,
  addText: true,
});

textileOptimizer.plotDistanceHeatmap({
  debug: true,
  name: 'heatmap-iteration0.svg',
});

console.log('Textile optimizer created');
// console.log(textileOptimizer);

const nbIterations = 9;
for (let i = 1; i <= nbIterations; i++) {
  console.log(`\n--- Iteration ${i} ---`);

  textileOptimizer.getNextGeneration();
  if (0) {
    textileOptimizer.savePopulationImages({
      dirname: `population-iteration${i}`,
      addText: true,
    });
  }
  textileOptimizer.plotDistanceHeatmap({
    debug: false,
    name: `heatmap-iteration${i}.svg`,
  });

  const currentBestGene = textileOptimizer.getBestGenes()[i - 1];
  console.log('New best score: ', currentBestGene.getFitnessScore());
}

textileOptimizer.saveBestGenesImages({ addText: true });

textileOptimizer.plotBestScores({ debug: false });

await textileOptimizer.saveResults();

console.log(
  '\nTotal run time:',
  textileOptimizer.stats.runTime.total.toFixed(2),
  's',
);
