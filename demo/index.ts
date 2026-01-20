import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/imageProcessing/extractPatternPieces.ts';
import { getRectangleFabric } from '../src/utils/getRectangleFabric.ts';
import { svgToIjs } from '../src/imageProcessing/svgToIjs.ts';
import { TextileGA } from '../src/textileGA/TextileGA.ts';
import { drawPieces } from '../src/utils/drawPieces.ts';

const geomImg = ['shapes-holes.svg', 'circles.svg', 'rectangles.svg'];
const geomDim = [
  { width: 40, length: 30 },
  { width: 40, length: 30 },
  { width: 40, length: 50 },
];

const freesewingImg = [
  'freesewing-aaron.svg',
  'freesewing-bee.svg',
  'freesewing-carlita.svg',
];
const freesewingDim = [
  { width: 150, length: 100 },
  { width: 150, length: 100 },
  { width: 150, length: 300 },
];

const img = freesewingImg[2];
const dim = freesewingDim[2];

// desired resolution of pattern pieces and fabric
const resolution = 1;
// intermediate pattern resolution
const patternResolution = 10;

const path = join(import.meta.dirname, '../data/', img);

const currentDir = import.meta.dirname;

// create a rectangular piece of fabric
const fabric = getRectangleFabric({ ...dim, resolution });

// convert the SVG to an image-js image
const pattern = await svgToIjs(path, { resolution: patternResolution });

await write(join(import.meta.dirname, 'pattern.png'), pattern);

// extract the pieces of the pattern
const pieces = extractPatternPieces(pattern, {
  debug: true,
  desiredResolution: resolution,
  patternResolution,
});

console.log(`Extracted ${pieces.length} pieces`);

const fabricDefaultPos = fabric.clone();

drawPieces(fabricDefaultPos, pieces, { showBoundingRectangles: true });

await write(
  join(import.meta.dirname, 'fabric-with-original-parts.png'),
  fabricDefaultPos,
);

// having a smaller population makes the algorithm converge faster??

const textileOptimizer = new TextileGA(fabric, pieces, {
  seed: 0,
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
    translationAmplitude: 1,
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

// good parameters:
// fitnessWeights: {
//   averageColumn: 1,
//   averageRow: 1,
//   overlap: 1000,
//   usedLength: 0,
//   packing: 1,
// },

textileOptimizer.saveConfig();

textileOptimizer.savePopulationImages({
  dirname: `population-iteration0`,
  addText: true,
  showBoundingRectangles: false,
});

textileOptimizer.plotDistanceHeatmap({
  debug: true,
  name: 'heatmap-iteration0.svg',
});

console.log('Textile optimizer created');
// console.log(textileOptimizer);

const nbIterations = 10;
for (let i = 1; i <= nbIterations; i++) {
  console.log(`\n--- Iteration ${i} ---`);

  textileOptimizer.getNextGeneration();
  if (0) {
    textileOptimizer.savePopulationImages({
      dirname: `population-iteration${i}`,
      addText: true,
      showBoundingRectangles: false,
    });
  }
  textileOptimizer.plotDistanceHeatmap({
    debug: false,
    name: `heatmap-iteration${i}.svg`,
  });

  const currentBestGene = textileOptimizer.getBestGenes()[i - 1];
  console.log('New best score: ', currentBestGene.getFitnessScore());
}

textileOptimizer.saveBestGenesImages({
  addText: true,
  showBoundingRectangles: true,
});

textileOptimizer.plotBestScores({ debug: false });

await textileOptimizer.saveResults();

console.log(
  '\nTotal run time:',
  textileOptimizer.stats.runTime.total.toFixed(2),
  's',
);
