import { expect, test } from 'vitest';
import { PatternPiece } from '../../PatternPiece.ts';
import { Image } from 'image-js';
import { TextileGA } from '../TextileGA.ts';

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
    optionsGA: { populationSize: 5, nbDiverseIndividuals: 0 },
  });

  console.log(textileGa);

  expect(textileGa.patternPieces).toBe(pieces);
  expect(textileGa.fabric).toBe(fabric);
  expect(textileGa.ga.options.populationSize).toBe(5);
  expect(textileGa.ga.population.length).toBe(5);
  expect(textileGa.ga.options.seed).toBe(textileGa.seed);
  expect(textileGa.ga.scoreType).toEqual('min');
});

test('compute first generation', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    optionsGA: { populationSize: 5, nbDiverseIndividuals: 0 },
  });

  textileGa.ga.computeNextGeneration();

  console.log(textileGa.ga.bestScoredIndividuals);

  expect(textileGa.ga.population.length).toBe(5);
  expect(textileGa.ga.bestScoredIndividuals.length).toBe(1);
  expect(textileGa.ga.iteration).toBe(1);
});

test('do 5 iterations with seed', () => {
  const textileGa = new TextileGA(fabric, pieces, {
    seed: 0,
    optionsGA: { populationSize: 5, nbDiverseIndividuals: 0 },
  });

  textileGa.ga.evolve(5);
  console.log({ bestIndividuals: textileGa.ga.bestScoredIndividuals });
  console.log(textileGa.getBestScores());

  expect(textileGa.ga.population.length).toBe(5);
  expect(textileGa.ga.bestScoredIndividuals.length).toBe(5);
  expect(textileGa.ga.iteration).toBe(5);
});
