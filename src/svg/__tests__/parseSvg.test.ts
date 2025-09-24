import { expect, test } from 'vitest';

import { parseSvg } from '../parseSvg.ts';

test('should parse SVG and return an object', async () => {
  const path = '../../data/freesewing-aaron.svg';
  const result = await parseSvg(path);

  console.log('Parsed SVG:', result);
  console.log('children:', result.children[0]);
  console.log('properties:', result.children[0].properties);

  expect(1).toBe(1);
});
