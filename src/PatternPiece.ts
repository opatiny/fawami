import type { Mask, Point, Roi } from 'image-js';

import { getCenterPoint } from './utils/getCenterPoint.ts';

export type PatternPieces = PatternPiece[];

export type Orientation = 0 | 90 | 180 | 270;

/**
 * Meta information for the pattern pieces
 */
export interface MetaInfo {
  /**
   * Width of the piece in pixels without rotation
   */
  width: number;
  /**
   * Height of the piece in pixels without rotation
   */
  height: number;
  /**
   * Center of the piece in pixels relative to the top-left corner of the mask, based on original orientation
   */
  center: Point;
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
   * Origin of the piece on the fabric relative to the **center** of the piece
   */
  centerOrigin?: Point;
  /**
   * Orientation of the piece in degrees (mathematical positive direction, counter-clockwise)
   */
  orientation?: Orientation;
}

export class PatternPiece {
  public readonly mask: Mask;
  public centerOrigin: Point;
  public orientation: Orientation;
  public readonly meta: MetaInfo;

  public constructor(mask: Mask, options: PatternPieceOptions = {}) {
    const { orientation = 0, centerOrigin = { row: 0, column: 0 } } = options;

    const center = getCenterPoint(mask.width, mask.height);

    const meta = {
      width: mask.width,
      height: mask.height,
      center,
      ...options.meta,
    };

    this.centerOrigin = centerOrigin;
    this.orientation = orientation;
    this.mask = mask;
    this.meta = meta;
  }

  public static createFromRoi(
    roi: Roi,
    options: PatternPieceOptions = {},
  ): PatternPiece {
    // roi has origin in top-left corner of the mask, so we need to adjust it to be relative to the center
    const center = getCenterPoint(roi.width, roi.height);
    const centerOrigin = {
      row: roi.origin.row + center.row,
      column: roi.origin.column + center.column,
    };
    return new PatternPiece(roi.getMask(), {
      orientation: 0,
      centerOrigin,
      meta: {
        width: roi.width,
        height: roi.height,
        center: {
          row: Math.floor(roi.height / 2),
          column: Math.floor(roi.width / 2),
        },
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
      centerOrigin: { ...piece.centerOrigin },
      orientation: piece.orientation,
    });
  }

  /**
   * Get mask with correct orientation.
   * @param piece - Piece to process
   * @returns Rotated mask.
   */
  public static getRotatedMask(piece: PatternPiece): Mask {
    const orientation = piece.orientation;
    const mask = piece.mask;

    if (orientation === 0) {
      return piece.mask;
    }

    const image = mask.convertColor('GREY');
    const rotated = image.rotate(-orientation);
    return rotated.threshold();
  }

  public static getRotatedWidth(piece: PatternPiece): number {
    const orientation = piece.orientation;
    if (orientation === 0 || orientation === 180) {
      return piece.meta.width;
    }
    return piece.meta.height;
  }

  public static getRotatedHeight(piece: PatternPiece): number {
    const orientation = piece.orientation;
    if (orientation === 0 || orientation === 180) {
      return piece.meta.height;
    }
    return piece.meta.width;
  }

  /**
   * Compute the center of the piece taking into account its orientation, relative to the top-left corner of the piece.
   * @param piece - Piece to process
   * @returns Rotated center point.
   */
  public static getRotatedCenter(piece: PatternPiece): Point {
    const orientation = piece.orientation;
    const center = piece.meta.center;
    if (orientation === 90) {
      return {
        row: piece.meta.width - 1 - center.column,
        column: center.row,
      };
    } else if (orientation === 180) {
      return {
        row: piece.meta.height - 1 - center.row,
        column: piece.meta.width - 1 - center.column,
      };
    } else if (orientation === 270) {
      return {
        row: center.column,
        column: piece.meta.height - 1 - center.row,
      };
    } else {
      return center;
    }
  }
  /**
   * Get the top-left origin of the piece relative to the fabric, while considering its orientation.
   * @param piece - Piece to process
   * @returns The top-left origin of the piece with orientation
   */
  public static getOriginWithOrientation(piece: PatternPiece): Point {
    const rotatedCenter = PatternPiece.getRotatedCenter(piece);
    return {
      row: piece.centerOrigin.row - rotatedCenter.row,
      column: piece.centerOrigin.column - rotatedCenter.column,
    };
  }
}
