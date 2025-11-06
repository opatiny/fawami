import { expect, test } from 'vitest';

import { PatternPiece } from '../PatternPiece.ts';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
]);
const piece = new PatternPiece(mask);

test('getRotatedMask: orientation 0', async () => {
  const result = PatternPiece.getRotatedMask(piece);

  expect(result).toMatchMask(mask);
});

test('getRotatedMask: orientation 90', async () => {
  piece.orientation = 90;
  const result = PatternPiece.getRotatedMask(piece);

  const expectedMask = testUtils.createMask([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ]);

  expect(result).toMatchMask(expectedMask);
});

test('getRotatedCenter: orientation 0', async () => {
  console.log(piece.meta.center);
  piece.orientation = 0;
  const result = PatternPiece.getRotatedCenter(piece);

  const expected = { row: 1, column: 1 };

  expect(result).toStrictEqual(expected);
});

test('getRotatedCenter: orientation 90', async () => {
  piece.orientation = 90;
  const result = PatternPiece.getRotatedCenter(piece);

  const expected = { row: 1, column: 1 };

  expect(result).toStrictEqual(expected);
});

test('getRotatedCenter: orientation 180', async () => {
  piece.orientation = 180;
  const result = PatternPiece.getRotatedCenter(piece);

  const expected = { row: 1, column: 2 };

  expect(result).toStrictEqual(expected);
});

test('getRotatedCenter: orientation 270', async () => {
  piece.orientation = 270;
  const result = PatternPiece.getRotatedCenter(piece);

  const expected = { row: 2, column: 1 };

  expect(result).toStrictEqual(expected);
});

test('getOriginWithOrientation: orientation 0', async () => {
  piece.orientation = 0;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = PatternPiece.getOriginWithOrientation(piece);

  const expectedOrigin = { row: -1, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});

test('getOriginWithOrientation: orientation 90', async () => {
  piece.orientation = 90;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = PatternPiece.getOriginWithOrientation(piece);

  const expectedOrigin = { row: -1, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});

test('getOriginWithOrientation: orientation 180', async () => {
  piece.orientation = 180;
  piece.centerOrigin = { row: 0, column: 0 };
  const result = PatternPiece.getOriginWithOrientation(piece);

  const expectedOrigin = { row: -1, column: -1 };

  expect(result).toStrictEqual(expectedOrigin);
});
