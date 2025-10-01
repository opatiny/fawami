import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { JSDOM } from 'jsdom';

const dataPath = '../../data';

const aaron = join(dataPath, 'freesewing-aaron-simplified.svg');

const rectangles = join(dataPath, 'rectangles.svg');

// read the svg as text
const svg = await readFile(join(import.meta.dirname, aaron), 'utf8');

// transform to a DOM
const dom = new JSDOM(svg, { contentType: 'image/svg+xml' });

console.log(dom.window.document.querySelectorAll('svg').length);

// create a new dom and copy only the paths
const newDom = new JSDOM(`<!DOCTYPE html><body></body>`, {
  contentType: 'image/svg+xml',
});

console.log(newDom);

const body = newDom.window.document.querySelector('body');

const svgElement = dom.window.document.querySelectorAll('svg')[0];

const width = svgElement.getAttribute('width');
const height = svgElement.getAttribute('height');

console.log({ width, height });

const newSvgElement = newDom.window.document.createElementNS(
  'http://www.w3.org/2000/svg',
  'svg',
);
newSvgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
newSvgElement.setAttribute('width', width);
newSvgElement.setAttribute('height', height);
newSvgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
body.append(newSvgElement);

const pathElements = dom.window.document.querySelectorAll(
  'path, rect, circle, ellipse, polygon, line',
);

console.log(pathElements.length);
