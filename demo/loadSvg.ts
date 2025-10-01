import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Mask, readCanvas, write } from 'image-js';
import { JSDOM } from 'jsdom';
import { Canvas, Image } from 'skia-canvas';

import { parseDimension } from './parseDimension.ts';

const filePath = '../data/freesewing-aaron.svg';

// read the svg as text
const svg = await readFile(join(import.meta.dirname, filePath), 'utf8');

const dom = new JSDOM(svg, { contentType: 'image/svg+xml' });

console.log(dom.window.document.querySelectorAll('svg').length);

const width = dom.window.document
  .querySelectorAll('svg')[0]
  .getAttribute('width');
const height = dom.window.document
  .querySelectorAll('svg')[0]
  .getAttribute('height');

console.log({ width, height });

// desired resolution
const dpcm = 10; // 10 pixels per cm

const widthPx = parseDimension(width, dpcm);
const heightPx = parseDimension(height, dpcm);

console.log({ widthPx, heightPx });

const pathElements = dom.window.document.querySelectorAll('path');

console.log(pathElements.length);

for (const pathElement of pathElements) {
  pathElement.setAttribute('fill', '#ff000');
  pathElement.removeAttribute('class');
}

const blackSVG = dom.serialize();

await writeFile(join(import.meta.dirname, 'test-black.svg'), blackSVG);

// width and height should be in px
const scale = 5;
const canvas = new Canvas(widthPx * scale, heightPx * scale);
const ctx = canvas.getContext('2d');

const img = new Image();
img.addListener('load', () => {
  ctx.drawImage(
    img,
    0,
    0,
    widthPx,
    heightPx,
    0,
    0,
    widthPx * scale,
    heightPx * scale,
  );
});
img.src = `data:image/svg+xml;utf8,${encodeURIComponent(blackSVG)}`;

const ijs = await readCanvas(canvas);
console.log(ijs);
write('test-black.png', ijs);

const mask = Mask.createFrom(ijs);
console.log(mask);

// save mask
write('mask.png', mask);

// await writeFile(
//   join(import.meta.dirname, 'test-black.png'),
//   await canvas.toBuffer('png'),
// );
