import type { Mask, Point, Roi } from 'image-js';

export type PatternPieces = PatternPiece[];

/**
 * Meta information for the pattern pieces
 */
export interface MetaInfo {
  /**
   * Width of the piece in pixels
   */
  width: number;
  /**
   * Height of the piece in pixels
   */
  height: number;
  /**
   * Resolution of the mask in pixels per cm
   */
  resolution?: number;
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
   * Number of holes in the piece
   * @default 0
   */
  numberHoles?: number;
}

export interface PatternPieceOptions {
  /**
   * Meta information about the piece
   * @default {}
   */
  meta?: MetaInfo;
  /**
   * Origin of the piece on the fabric (top-left corner of the mask)
   */
  origin?: Point;
  /**
   * Orientation of the piece in degrees (mathematical positive direction, counter-clockwise)
   */
  orientation?: number;
}

export class PatternPiece {
  public readonly mask: Mask;
  public origin: Point;
  public orientation: number;
  public readonly meta: MetaInfo;

  public constructor(mask: Mask, options: PatternPieceOptions = {}) {
    const { orientation = 0, origin = { row: 0, column: 0 } } = options;

    const meta = { width: mask.width, height: mask.height, ...options.meta };

    this.origin = origin;
    this.orientation = orientation;
    this.mask = mask;
    this.meta = meta;
  }

  public static createFromRoi(
    roi: Roi,
    options: PatternPieceOptions = {},
  ): PatternPiece {
    return new PatternPiece(roi.getMask(), {
      orientation: 0,
      origin: roi.origin,
      meta: {
        width: roi.width,
        height: roi.height,
        surface: roi.surface,
        centroid: roi.centroid,
        numberHoles: roi.holesInfo.number,
        ...options.meta,
      },
    });
  }

  public static clone(piece: PatternPiece): PatternPiece {
    // copy pointer to mask and meta, and copy origin and orientation
    return new PatternPiece(piece.mask, {
      meta: piece.meta,
      origin: { ...piece.origin },
      orientation: piece.orientation,
    });
  }
}
