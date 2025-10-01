/* eslint-disable unicorn/prefer-add-event-listener */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Mask, readCanvas, write } from 'image-js';
import { JSDOM } from 'jsdom';
import { Canvas, Image } from 'skia-canvas';

import { parseDimension } from '../parseDimension.ts';

const aaron = '../data/freesewing-aaron-simplified.svg';

const rectangles = '../data/rectangles.svg';

// read the svg as text
const svg = await readFile(join(import.meta.dirname, aaron), 'utf8');

// transform to a DOM
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

const pathElements = dom.window.document.querySelectorAll(
  'path, rect, circle, ellipse, polygon, line',
);

console.log(pathElements.length);

for (const pathElement of pathElements) {
  pathElement.removeAttribute('class');
  pathElement.removeAttribute('style');
  pathElement.setAttribute('fill', '#fff000');
  pathElement.setAttribute('stroke', '#ffffff');
  pathElement.setAttribute('stroke-width', '1');
}

const blackSVG = dom.serialize();

await writeFile(join(import.meta.dirname, 'test-black.svg'), blackSVG);

// width and height should be in px
const scale = 1;
const canvas = new Canvas(widthPx * scale, heightPx * scale);

const ctx = canvas.getContext('2d');

const img = new Image();
img.onload = function () {
  ctx.drawImage(img, 0, 0, width, height, 0, 0, width * 2, height * 2);
};
console.log(blackSVG);

img.src = `data:image/svg+xml;utf8,${encodeURIComponent(blackSVG.replaceAll('mm', ''))}`;

await writeFile(
  join(import.meta.dirname, 'canvas.png'),
  await canvas.toBuffer('png'),
);

const ijs = await readCanvas(canvas);
console.log(ijs);
write(join(import.meta.dirname, 'test-black.png'), ijs);

const mask = Mask.createFrom(ijs);
console.log(mask);

// save mask
write(join(import.meta.dirname, 'mask.png'), mask);
