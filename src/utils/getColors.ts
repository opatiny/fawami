import type { Image } from 'image-js';

import { hsvToRgb } from './hsvToRgb.ts';

/**
 * Create an array of distinct colors (rainbow).
 * @param nbColors - Number of colors to generate
 * @param image - Image for which to generate colors
 * @returns An array of distinct colors in correct color model
 */
export function getColors(nbColors: number, image: Image): number[][] {
  const colorModel = image.colorModel;
  const maxValue = image.maxValue;

  const colors: number[][] = [];

  if (colorModel === 'GREY' || colorModel === 'GREYA') {
    for (let i = 0; i < nbColors; i++) {
      const grey = [Math.round((i * maxValue) / nbColors)];
      if (colorModel === 'GREYA') {
        grey.push(maxValue);
      }
      colors.push(grey);
    }
  } else if (colorModel === 'RGB' || colorModel === 'RGBA') {
    for (let i = 0; i < nbColors; i++) {
      const hue = Math.round((i * 360) / nbColors);
      const hsv = [hue, maxValue, maxValue];
      const rgb = hsvToRgb(hsv);
      if (colorModel === 'RGBA') {
        rgb.push(maxValue);
      }
      colors.push(rgb);
    }
  } else {
    throw new Error(`getColors: Color model ${colorModel} is not supported`);
  }

  return colors;
}
