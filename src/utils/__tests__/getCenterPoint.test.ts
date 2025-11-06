import { expect, test } from 'vitest';

import { getCenterPoint } from '../getCenterPoint.ts';

test('w=3, h=3', async () => {
  const result = getCenterPoint(3, 3);

  expect(result).toStrictEqual({ row: 1, column: 1 });
});

test('w=4, h=3', async () => {
  const result = getCenterPoint(4, 3);

  expect(result).toStrictEqual({ row: 1, column: 1 });
});

test('w=3, h=4', async () => {
  const result = getCenterPoint(3, 4);

  expect(result).toStrictEqual({ row: 1, column: 1 });
});
