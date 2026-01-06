import { expect, test } from 'vitest';
import { PatternPiece } from '../../patternPiece/PatternPiece.ts';
import { Image } from 'image-js';
import { TextileGA } from '../TextileGA.ts';

const currentDir = import.meta.dirname;

const mask1 = testUtils.createMask([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

const mask2 = testUtils.createMask([
  [1, 1],
  [1, 0],
  [1, 0],
]);

const piece1 = new PatternPiece(mask1);
const piece2 = new PatternPiece(mask2);

const pieces = [piece1, piece2];

const fabric = new Image(10, 10);

test('test constructor', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    optionsGA: { populationSize: 5, eliteSize: 5 },
  });

  expect(textileGa.patternPieces).toBe(pieces);
  expect(textileGa.fabric).toBe(fabric);
  expect(textileGa.getGaOptions().populationSize).toBe(5);
});

test('compute first generation', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    optionsGA: { populationSize: 5, eliteSize: 5 },
  });

  textileGa.getNextGeneration();

  expect(textileGa.getBestScores().length).toBe(1);
  expect(textileGa.stats.runTime.iterations.length).toBe(1);
  expect(textileGa.stats.packings.length).toBe(1);
  expect(textileGa.stats.runTime.total).toBeGreaterThan(0);
});

test('do 5 iterations with seed', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    seed: 0,
    optionsGA: { populationSize: 5, eliteSize: 5 },
  });

  textileGa.evolve(5, true);
  console.log('best scores:', textileGa.getBestScores());

  expect(textileGa.getBestScores().length).toBe(5);
});

test('population size = 100', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    seed: 0,
    optionsGA: { populationSize: 100, eliteSize: 100 },
  });
  textileGa.savePopulationImages({
    dirname: 'initialPopulation',
  });

  textileGa.plotDistanceHeatmap({
    debug: false,
    name: 'heatmap-iteration0.svg',
  });

  textileGa.evolve(5, false);

  textileGa.saveBestGenesImages();

  textileGa.plotBestScores({ debug: false });

  textileGa.savePopulationImages({
    dirname: 'population-iteration5',
  });

  textileGa.plotDistanceHeatmap({
    debug: false,
    name: 'heatmap-iteration5.svg',
  });
  expect(textileGa.getBestScores().length).toBe(5);
});
