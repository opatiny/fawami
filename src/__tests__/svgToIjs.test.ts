import { expect, test } from 'vitest';

import { getPath } from '../../test/testUtils.ts';
import { svgToIjs } from '../svgToIjs.ts';

test('default options, rectangles', () => {
  const path = getPath('rectangles.svg');

  console.log(path);

  const blurred = svgToIjs(path);

  expect(blurred).toMatchImageSnapshot();
});
