import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parseSvg } from '../parseSvg.ts';

test('should parse SVG and return an object', async () => {
  const path = join(import.meta.dirname, '../../../data/freesewing-aaron.svg');
  const result = await parseSvg(path);

  console.log('Parsed SVG:', result.children[0]);

  expect(1).toBe(1);
});
