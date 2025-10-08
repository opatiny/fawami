import type { Image, Mask } from 'image-js';

/**
 * Redefine origins of masks to random positions within the fabric
 * @param fabric
 * @param masks
 * @returns
 */
export function placeRandomInFabric(fabric: Image, masks: Mask[]): Mask[] {
  const minX = 0;
  const minY = 0;
  for (let i = 0; i < masks.length; i++) {
    const mask = masks[i] as Mask;
    const maxX = fabric.width - mask.width;
    const maxY = fabric.height - mask.height;

    if (maxX < 0 || maxY < 0) {
      throw new Error(`Mask ${i} is too large to fit in the fabric`);
    }
    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    mask.origin = { column: x, row: y };
  }
  return masks;
}
