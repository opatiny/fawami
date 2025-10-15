import type { Point } from 'image-js';

export interface PieceLocation {
  /**
   * With respect to the top-left corner of the piece on the fabric
   */
  origin: Point;
  /**
   * Orientation of the piece in degrees (mathematical positive direction, counter-clockwise)
   */
  orientation: number;
}

export type PiecesLocations = PieceLocation[];
