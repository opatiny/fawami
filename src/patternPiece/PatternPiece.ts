import type { Mask, Point, Roi } from 'image-js';

import { getCenterPoint } from '../utils/getCenterPoint.ts';

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
   * Resolution of the pattern piece in pixels per cm
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
   * Orientation of the piece in degrees (mathematical positive direction, counter-clockwise).
   * The piece is first placed at the center origin, then rotated around its center.
   */
  orientation?: Orientation;
  /**
   * Resolution of the input pieces (mask or ROI) in pixels per cm
   */
  inputResolution?: number;
  /**
   * Desired resolution of the masks of the pattern pieces in pixels per cm
   */
  desiredResolution?: number;
}

export class PatternPiece {
  public readonly mask: Mask;
  public centerOrigin: Point;
  public orientation: Orientation;
  public readonly meta: MetaInfo;

  // todo: resolution not handled when using constructor directly
  public constructor(mask: Mask, options: PatternPieceOptions = {}) {
    const { orientation = 0, centerOrigin = { row: 0, column: 0 } } = options;

    const center = getCenterPoint(mask.width, mask.height);
    const meta = {
      width: mask.width,
      height: mask.height,
      center,
      surface: mask.getNbNonZeroPixels(),
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
    const { desiredResolution = 10, inputResolution = 10 } = options;

    let mask = roi.getMask();
    if (desiredResolution !== inputResolution) {
      // scale roi mask to match resolution
      const scale = desiredResolution / inputResolution;
      // we have to convert to image and then back to mask
      mask = mask
        .convertColor('GREY')
        .resize({
          xFactor: scale,
          yFactor: scale,
        })
        .threshold();
    }

    // roi has origin in top-left corner of the mask, so we need to adjust it to be relative to the center
    const center = getCenterPoint(mask.width, mask.height);
    const centerOrigin = {
      row: roi.origin.row + center.row,
      column: roi.origin.column + center.column,
    };
    return new PatternPiece(mask, {
      orientation: 0,
      centerOrigin,
      meta: {
        width: mask.width,
        height: mask.height,
        center: {
          row: Math.floor(mask.height / 2),
          column: Math.floor(mask.width / 2),
        },
        numberHoles: roi.holesInfo.number,
        resolution: desiredResolution,
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
   * @returns Rotated mask.
   */
  public getRotatedMask(): Mask {
    const orientation = this.orientation;
    const mask = this.mask;

    if (orientation === 0) {
      return this.mask;
    }

    const image = mask.convertColor('GREY');
    const rotated = image.rotate(-orientation);
    return rotated.threshold();
  }

  /**
   * Get width of rotated piece.
   * @returns Width of rotated piece.
   */
  public getRotatedWidth(): number {
    const orientation = this.orientation;
    if (orientation === 0 || orientation === 180) {
      return this.meta.width;
    }
    return this.meta.height;
  }

  /**
   * Get height of rotated piece.
   * @returns Height of rotated piece.
   */
  public getRotatedHeight(): number {
    const orientation = this.orientation;
    if (orientation === 0 || orientation === 180) {
      return this.meta.height;
    }
    return this.meta.width;
  }

  /**
   * Compute the center of the piece taking into account its orientation, relative to the top-left corner of the piece.
   * @returns Center point of the piece relative to its top-left corner.
   */
  public getRelativeCenter(): Point {
    const orientation = this.orientation;
    const center = this.meta.center;
    if (orientation === 90) {
      return {
        row: this.meta.width - 1 - center.column,
        column: center.row,
      };
    } else if (orientation === 180) {
      return {
        row: this.meta.height - 1 - center.row,
        column: this.meta.width - 1 - center.column,
      };
    } else if (orientation === 270) {
      return {
        row: center.column,
        column: this.meta.height - 1 - center.row,
      };
    } else {
      return center;
    }
  }
  /**
   * Get the top-left origin of the piece relative to the fabric, while considering its orientation.
   * @returns The top-left origin of the piece with orientation
   */
  public getTopLeftOrigin(): Point {
    const rotatedCenter = this.getRelativeCenter();
    return {
      row: this.centerOrigin.row - rotatedCenter.row,
      column: this.centerOrigin.column - rotatedCenter.column,
    };
  }
}
