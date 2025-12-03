import { join } from 'node:path';

import geneticAlgorithmConstructor from 'geneticalgorithm';
import { write } from 'image-js';

import { extractPatternPieces } from '../../src/extractPatternPieces.ts';
import type { Gene } from '../../src/geneticAlgo/Gene.ts';
import { crossover1Point } from '../../src/geneticAlgo/crossover1Point.ts';
import { getFitness } from '../../src/geneticAlgo/getFitness.ts';
import { getRandomGenes } from '../../src/geneticAlgo/getRandomGenes.ts';
import { mutateTranslate } from '../../src/geneticAlgo/mutateTranslate.ts';
import { getRectangleFabric } from '../../src/getRectangleFabric.ts';
import { svgToIjs } from '../../src/svgToIjs.ts';
import { savePopulationImages } from '../../src/utils/savePopulationImages.ts';

const img1 = 'shapes-holes.svg';
const dim1 = { width: 20, length: 30 };

const path = join(import.meta.dirname, '../data/', img1);

// create a rectangular piece of fabric
const fabric = getRectangleFabric(dim1);

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

// create GeneticAlgorithm instance
function crossover(parent1: Gene, parent2: Gene): [Gene, Gene] {
  console.log('Inside crossover');
  console.log({ parent1, parent2 });
  return crossover1Point(parent1, parent2);
}

function mutate(gene: Gene): Gene {
  console.log('Inside mutate');
  console.log(gene);
  return mutateTranslate(fabric, gene);
}

function fitness(gene: Gene): number {
  return gene.fitness.score;
}

function compare(a: Gene, b: Gene): boolean {
  const fitnessA = getFitness(a.patternPieces).score;
  const fitnessB = getFitness(b.patternPieces).score;
  return fitnessA >= fitnessB;
}

const config = {
  mutationFunction: mutate,
  crossoverFunction: crossover,
  fitnessFunction: fitness,
  // doesABeatBFunction: compare,
  population: initialPopulation,
  populationSize: 10, // defaults to 100
};

const ga = geneticAlgorithmConstructor(config);

const generation = ga.evolve();

// for (let i = 0; i < 5; i++) {
//   const generation = ga.evolve();
//   console.log(`Generation ${i} best fitness: ${generation[0].fitness}`);
//   savePopulationImages(
//     fabric,
//     generation.map((g) => g.entity),
//     { path: import.meta.dirname },
//   );
// }
