import type { Mask, Point, Roi } from 'image-js';

export interface PatternPieceOptions {
  resolution?: number; // pixels per cm
  orientation?: number; // in degrees, mathematical positive direction (counter-clockwise)
}

export class PatternPiece {
  public readonly mask: Mask;
  public origin: Point;
  public readonly width: number;
  public readonly height: number;
  public readonly orientation: number;
  public readonly surface: number; // in pixels
  public readonly centroid: Point; // location of center of mass relative to top-left corner of the mask
  public readonly resolution: number; // pixels per cm

  public constructor(roi: Roi, options: PatternPieceOptions = {}) {
    const { resolution = 10, orientation = 0 } = options;
    this.mask = roi.getMask();
    this.origin = roi.origin;
    this.width = roi.width;
    this.height = roi.height;
    this.orientation = orientation;
    this.surface = roi.surface;
    this.centroid = roi.centroid;
    this.resolution = resolution;
  }
}
