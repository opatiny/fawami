import type { Mask, Point, Roi } from 'image-js';

export interface PatternPieceOptions {
  /**
   * Resolution of the mask in pixels per cm
   */
  resolution?: number;
  /**
   * Orientation of the piece in degrees (mathematical positive direction, counter-clockwise)
   */
  orientation?: number;
  /**
   * Surface of the piece in pixels
   * @default undefined
   */
  surface?: number;
  /**
   * Center of mass of the piece relative to the top-left corner of the mask
   * @default undefined
   */
  centroid?: Point;
  /**
   * Whether the piece contains holes
   * @default false
   */
  numberHoles?: number;
}

export class PatternPiece {
  public readonly mask: Mask;
  public origin: Point;
  public readonly width: number;
  public readonly height: number;
  public readonly orientation: number;
  public readonly surface: number | undefined; // in pixels
  public readonly centroid: Point | undefined; // location of center of mass relative to top-left corner of the mask
  public readonly resolution: number; // pixels per cm
  public readonly numberHoles: number | undefined;

  public constructor(mask: Mask, options: PatternPieceOptions = {}) {
    const {
      resolution = 10,
      orientation = 0,
      numberHoles = undefined,
      centroid = undefined,
      surface = undefined,
    } = options;
    this.mask = mask;
    this.origin = mask.origin;
    this.width = mask.width;
    this.height = mask.height;
    this.orientation = orientation;
    this.surface = surface;
    this.centroid = centroid;
    this.resolution = resolution;
    this.numberHoles = numberHoles;
  }

  public static createFromRoi(
    roi: Roi,
    options: PatternPieceOptions = {},
  ): PatternPiece {
    return new PatternPiece(roi.getMask(), {
      surface: roi.surface,
      centroid: roi.centroid,
      numberHoles: roi.holesInfo.number,
      ...options,
    });
  }
}
