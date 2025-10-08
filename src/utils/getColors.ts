import { hsvToRgb } from './hsvToRgb.ts';

/**
 * Create an array of distinct colors (rainbow).
 * @param nbColors - Number of colors to generate
 * @returns An array of colors in RGB format
 */
export function getColors(nbColors: number): Uint8Array[] {
  const colors: Uint8Array[] = [];

  for (let i = 0; i < nbColors; i++) {
    const hue = Math.round((i * 360) / nbColors);
    const hsv = [hue, 255, 255];
    const rgb = hsvToRgb(hsv);
    colors.push(rgb);
  }
  return colors;
}
