export function parseDimension(dim: string, dpcm: number): number {
  let px = 0;
  if (dim?.endsWith('mm')) {
    const mm = Number.parseFloat(dim.replace('mm', ''));
    // convert mm to cm and then to pixels
    px = (mm / 10) * dpcm;
  } else {
    px = Number.parseFloat(dim);
  }
  return Math.round(px);
}
