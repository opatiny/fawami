import { expect, test } from 'vitest';

import { getRectangleFabric } from '../getRectangleFabric.ts';

test('default options', async () => {
  const fabric = getRectangleFabric();

  expect(fabric.width).toBe(2000);
  expect(fabric.height).toBe(1500);
  expect(fabric.colorModel).toBe('RGBA');
});
