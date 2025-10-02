import { expect, test } from 'vitest';

import { getPath } from '../../test/testUtils.ts';
import { svgToIjs } from '../svgToIjs.ts';

test('default options, rectangles', async () => {
  // size: 210x297mm
  const path = getPath('rectangles.svg');

  console.log(path);

  const image = await svgToIjs(path);

  expect(image).toMatchImageSnapshot();
});
