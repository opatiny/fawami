import { test } from 'vitest';

import { Matrix } from 'ml-matrix';
import { plotHeatMap } from '../plotHeatMap.ts';

const distances = new Matrix([
  [0, 1],
  [1, 0],
  [2, 3],
]);

test('plot heat map', () => {
  plotHeatMap(distances, {
    path: import.meta.dirname,
    name: 'testHeatMap.svg',
    nbColors: 5,
    debug: true,
  });
});
