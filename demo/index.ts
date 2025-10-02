import { join } from 'node:path';

import { write } from 'image-js';

import { svgToIjs } from '../src/svgToIjs.ts';

const path = join(import.meta.dirname, '../data/shapes-holes.svg');

const pattern = await svgToIjs(path);

await write(join(import.meta.dirname, 'pattern.png'), pattern);
