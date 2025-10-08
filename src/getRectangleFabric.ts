import { Image } from 'image-js';

interface GetFabricOptions {
  resolution?: number; // pixels per cm
  width?: number; // cm
  length?: number; // cm
}

/**
 * Create an image for the fabric, the fabric length is along the X axis.
 * @param options - options to create the fabric
 * @returns An image representing the fabric
 */
export function getRectangleFabric(options: GetFabricOptions = {}): Image {
  const { resolution = 10, width = 150, length = 200 } = options;
  const fabric = new Image(length * resolution, width * resolution, {
    colorModel: 'RGB',
    bitDepth: 8,
  }).fill(0);
  return fabric;
}
