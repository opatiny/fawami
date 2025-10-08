// todo: test edge cases

/**
 * Parse width or height svg attribute value and return the value in pixels.
 * @param dim - Dimension as a string (e.g. '210mm' or '100')
 * @returns Dimension in pixels
 */
export function parseDimension(dim: string): number {
  let px = 0;
  if (dim?.endsWith('mm')) {
    const mm = Number.parseFloat(dim.replace('mm', ''));
    // convert mm to cm and then to pixels
    px = mm;
  } else {
    px = Number.parseFloat(dim);
  }
  return Math.round(px);
}
