import type { Image, Roi } from 'image-js';

export function topLeftMbr(
  fabric: Image,
  rois: Roi[],
  sequence: number[] = Array.from({ length: rois.length }, (_, i) => i),
): Image {
  if (sequence.length !== rois.length) {
    throw new Error('sequence length must match rois length');
  }
  return fabric;
}
