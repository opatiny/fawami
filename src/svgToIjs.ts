/* eslint-disable unicorn/prefer-add-event-listener */
import { readFile } from 'node:fs/promises';

import type { Image as IJS } from 'image-js';
import { readCanvas } from 'image-js';
import { JSDOM } from 'jsdom';
import { Canvas, Image } from 'skia-canvas';

import { parseDimension } from './utils/parseDimension.ts';

/**
 * Convert an SVG image to an image-js object.
 * @param path - Path to the svg file
 * @param resolution - Resolution of the output image in pixels per cm
 * @param debug - Display debug information?
 * @returns The image-js image
 */
export async function svgToIjs(
  path: string,
  resolution = 10,
  debug = false,
): Promise<IJS> {
  // read the svg as text
  const svg = await readFile(path, 'utf8');

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

  if (debug) {
    console.log({ width, height });
  }

  const widthPx = parseDimension(width);
  const heightPx = parseDimension(height);

  if (debug) {
    console.log({ widthPx, heightPx });
  }

  const elements = dom.window.document.querySelectorAll(
    'path, rect, circle, ellipse, polygon, line',
  );

  if (debug) {
    console.log('number of elements to fill:', elements.length);
  }

  for (const pathElement of elements) {
    pathElement.removeAttribute('class');
    pathElement.removeAttribute('style');
    pathElement.setAttribute('fill', '#000000');
  }

  const blackSVG = dom.serialize();

  // by default 1mm = 1 pixel
  const scale = resolution / 10;

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

  const ijs = readCanvas(canvas);

  return ijs;
}
