/* eslint-disable unicorn/prefer-add-event-listener */
import { readFile, writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Mask, readCanvas, write } from 'image-js';
import { JSDOM } from 'jsdom';
import { Canvas, Image } from 'skia-canvas';

import { parseDimension } from './parseDimension.ts';

const outputDir = './output/';
// create output dir if it doesn't exist
await mkdir(join(import.meta.dirname, outputDir), { recursive: true });

const dataPath = '../../data';

const aaron = join(dataPath, 'freesewing-aaron.svg');
const rectangles = join(dataPath, 'rectangles.svg');

// read the svg as text
const svg = await readFile(join(import.meta.dirname, aaron), 'utf8');

// transform to a DOM
const dom = new JSDOM(svg, { contentType: 'image/svg+xml' });

const svgElement = dom.window.document.querySelectorAll('svg')[0];

// remove xmlns:svg attribute -> otherwise canvas won't work
svgElement.removeAttribute('xmlns:svg');

// remove all textt elements
const textElements = dom.window.document.querySelectorAll('text');
for (const textElement of textElements) {
  textElement.remove();
}

// retrieve width and height
const width = svgElement.getAttribute('width');
const height = svgElement.getAttribute('height');

console.log({ width, height });

const widthPx = parseDimension(width);
const heightPx = parseDimension(height);

console.log({ widthPx, heightPx });

const elements = dom.window.document.querySelectorAll(
  'path, rect, circle, ellipse, polygon, line',
);

console.log(elements.length);

for (const pathElement of elements) {
  pathElement.removeAttribute('class');
  pathElement.removeAttribute('style');
  pathElement.setAttribute('fill', '#000000');
}

const blackSVG = dom.serialize();

await writeFile(join(import.meta.dirname, outputDir, 'black.svg'), blackSVG);

// width and height should be in px

// desired resolution
const dpcm = 10; // pixels per cm

// by default 1mm = 1 pixel

const scale = dpcm / 10;

const canvas = new Canvas(widthPx * scale, heightPx * scale);

const ctx = canvas.getContext('2d');

const img = new Image();
img.onload = () => {
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
};

img.src = `data:image/svg+xml;utf8,${encodeURIComponent(blackSVG.replaceAll('mm', ''))}`;

await writeFile(
  join(import.meta.dirname, outputDir, 'canvas.png'),
  await canvas.toBuffer('png'),
);

const ijs = await readCanvas(canvas);
console.log(ijs);
write(join(import.meta.dirname, outputDir, 'image.png'), ijs);
