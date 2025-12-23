import { expect, test } from 'vitest';

import { getBitWithOrientation } from '../getBitWithOrientation.ts';

const image = testUtils.createGreyImage([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

test('row=1, column=1, orientation=0', async () => {
  const result = getBitWithOrientation(image, { row: 1, column: 1 }, 0);

  expect(result).toBe(5);
});

test('row=1, column=1, orientation=90', async () => {
  const result = getBitWithOrientation(image, { row: 1, column: 1 }, 90);

  expect(result).toBe(5);
});

test('row=0, column=2, orientation=90', async () => {
  const result = getBitWithOrientation(image, { row: 0, column: 2 }, 90);

  expect(result).toBe(9);
});

test('row=0, column=0, orientation=180', async () => {
  const result = getBitWithOrientation(image, { row: 0, column: 0 }, 180);

  expect(result).toBe(9);
});

test('row=0, column=1, orientation=270', async () => {
  const result = getBitWithOrientation(image, { row: 0, column: 1 }, 270);

  expect(result).toBe(4);
});

const image2 = testUtils.createGreyImage([
  [1, 2, 3],
  [4, 5, 6],
]);

test('row=0, column=0, orientation=0 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 0, column: 0 }, 0);

  expect(result).toBe(1);
});
test('row=0, column=0, orientation=90 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 0, column: 0 }, 90);

  expect(result).toBe(3);
});

test('row=1, column=1, orientation=90 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 1, column: 1 }, 90);

  expect(result).toBe(5);
});

test('row=0, column=2, orientation=90 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 0, column: 1 }, 90);

  expect(result).toBe(6);
});

test('row=0, column=0, orientation=180 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 0, column: 0 }, 180);

  expect(result).toBe(6);
});

test('row=0, column=0, orientation=270 (asym)', async () => {
  const result = getBitWithOrientation(image2, { row: 0, column: 0 }, 270);

  expect(result).toBe(4);
});
