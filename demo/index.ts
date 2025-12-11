import { join } from 'node:path';

import { write } from 'image-js';

import { extractPatternPieces } from '../src/extractPatternPieces.ts';
import { getDistantGenes } from '../src/textileGA/getDistantGenes.ts';
import { getRandomGenes } from '../src/textileGA/getRandomGenes.ts';
import { mutateAndKeepBest } from '../src/textileGA/mutateAndKeepBest.ts';
import { getRectangleFabric } from '../src/getRectangleFabric.ts';
import { svgToIjs } from '../src/svgToIjs.ts';
import { savePopulationImages } from '../src/utils/savePopulationImages.ts';
import { TextileGA } from '../src/textileGA/TextileGA.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };
const img2 = 'freesewing-aaron.svg';
const dim2 = { width: 150, length: 100 };

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
  seed: 0,
  optionsGA: {
    populationSize: 10,
    nbDiverseIndividuals: 5,
    enableMutation: true,
    enableCrossover: true,
  },
  crossoverOptions: { minCrossoverFraction: 0.2 },
  mutateOptions: { translationAmplitude: 10 },
  fitnessWeights: {
    averageColumn: 0,
    averageRow: 0,
    overlap: 10,
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

const nbIterations = 3;
for (let i = 1; i <= nbIterations; i++) {
  console.log(`\n--- Iteration ${i} ---`);

  textileOptimizer.ga.computeNextGeneration(false);

  // textileOptimizer.savePopulationImages({
  //   dirname: `population-iteration${i}`,
  //   addNumbers: true,
  // });

  textileOptimizer.plotDistanceHeatmap({
    debug: false,
    name: `heatmap-iteration${i}.svg`,
  });

  const currentBestGene = textileOptimizer.ga.bestScoredIndividuals[i - 1];
  console.log('New best score: ', currentBestGene.score);
  // console.log('Fitness data: ', currentBestGene.data.fitness);
}

textileOptimizer.saveBestGenesImages({ addText: true });

textileOptimizer.plotBestScores({ debug: false });
