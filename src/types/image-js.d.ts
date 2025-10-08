import type { Point as IJPoint } from 'image-js';

declare module 'image-js' {
  // override Mask.origin to be writable (use image-js's Point type)
  interface Mask {
    origin: IJPoint;
  }
  interface Roi {
    origin: IJPoint;
  }
}
