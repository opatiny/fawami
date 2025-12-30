import { expect, test } from 'vitest';

import { getPath } from '../../test/testUtils.ts';
import { svgToIjs } from '../imageProcessing/svgToIjs.ts';

test('default options, rectangles', async () => {
  // size: 210x297mm
  const path = getPath('rectangles.svg');

  const image = await svgToIjs(path);

  expect(image).toMatchImageSnapshot();
  expect(image.width).toBe(210);
  expect(image.height).toBe(297);
});

test('default options, resolution of 20dpcm', async () => {
  // size: 210x297mm
  const path = getPath('rectangles.svg');

  const image = await svgToIjs(path, { resolution: 20 });

  expect(image).toMatchImageSnapshot();
  expect(image.width).toBe(210 * 2);
  expect(image.height).toBe(297 * 2);
});
