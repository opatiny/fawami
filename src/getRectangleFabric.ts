import { Image } from 'image-js';

interface GetFabricOptions {
  resolution?: number; // pixels per mm
  width?: number; // cm
  length?: number; // cm
}

/**
 * Create an image for the fabric
 * @param options - options to create the fabric
 * @returns An image representing the fabric
 */
export function getRectangleFabric(options: GetFabricOptions = {}): Image {
  const { resolution = 10, width = 150, length = 200 } = options;
  const fabric = new Image(length * resolution, width * resolution, {
    colorModel: 'GREY',
    bitDepth: 8,
  }).fill(0);
  return fabric;
}
