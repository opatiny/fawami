import type { Image, Mask } from 'image-js';

export function topLeftMbr(
  fabric: Image,
  masks: Mask[],
  sequence: number[] = Array.from({ length: masks.length }, (_, i) => i),
): Image {
  if (masks.length === 0) {
    return fabric;
  }

  if (sequence.length !== masks.length) {
    throw new Error('sequence length must match masks length');
  }

  let currentY = 0;

  const startOrigin = { x: fabric.width, y: fabric.height };

  for (const i of sequence) {
    const mask = masks[i];

    const freeHeight = fabric.height - currentY;
    if (freeHeight < mask.height) {
      console.log(
        `Not enough space to place piece ${i} (height: ${mask.height}) at y=${currentY} (free height: ${freeHeight})`,
      );
      break;
    }
  }
  return fabric;
}
