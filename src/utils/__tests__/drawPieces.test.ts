import { Image } from 'image-js';
import { expect, test } from 'vitest';

import { PatternPiece } from '../../PatternPiece.ts';
import { drawPieces } from '../drawPieces.ts';

const mask = testUtils.createMask([
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 0],
]);
const piece = new PatternPiece(mask);

test('centerOrigin: (0,0), orientation = 0', async () => {
  piece.orientation = 0;
  piece.centerOrigin = { row: 0, column: 0 };
  const fabric = new Image(4, 4);
  drawPieces(fabric, [piece], { showBoundingRectangles: false });

  expect(fabric).toMatchImageSnapshot();
});

test('centerOrigin: (1,1), orientation = 0', async () => {
  piece.orientation = 0;
  piece.centerOrigin = { row: 1, column: 1 };
  const fabric = new Image(4, 4);
  drawPieces(fabric, [piece], { showBoundingRectangles: false });

  expect(fabric).toMatchImageSnapshot();
});

test('centerOrigin: (1,1), orientation = 90', async () => {
  piece.orientation = 90;
  piece.centerOrigin = { row: 1, column: 1 };
  const fabric = new Image(4, 4);
  drawPieces(fabric, [piece], { showBoundingRectangles: false });

  expect(fabric).toMatchImageSnapshot();
});

test('bounding rectangle, orientation = 0', async () => {
  const mask = testUtils.createMask([
    [1, 1],
    [1, 0],
    [1, 0],
  ]);
  const piece = new PatternPiece(mask);

  piece.orientation = 0;
  piece.centerOrigin = { row: 1, column: 1 };
  const fabric = new Image(4, 4);
  drawPieces(fabric, [piece]);

  expect(fabric).toMatchImageSnapshot();
});

test('bounding rectangle, orientation = 90', async () => {
  const mask = testUtils.createMask([
    [1, 1],
    [1, 0],
    [1, 0],
  ]);
  const piece = new PatternPiece(mask);

  piece.orientation = 90;
  piece.centerOrigin = { row: 1, column: 1 };
  const fabric = new Image(4, 4);
  drawPieces(fabric, [piece]);

  expect(fabric).toMatchImageSnapshot();
});
