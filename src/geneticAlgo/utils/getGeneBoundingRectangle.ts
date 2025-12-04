import type { Point } from 'image-js';
import type { Gene } from '../geneticAlgo/Gene.ts';

export interface Rectangle {
  /**
   * Top-left corner of the rectangle
   */
  origin: Point;
  width: number;
  height: number;
}

/**
 * Get the bounding rectangle of a gene (set of pattern pieces).
 * @param gene - The gene to get the bounding rectangle for
 * @returns The bounding rectangle
 */
export function getGeneBoundingRectangle(gene: Gene): Rectangle {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const piece of gene.patternPieces) {
    const topLeft = piece.getTopLeftOrigin();
    const width = piece.getRotatedWidth();
    const height = piece.getRotatedHeight();

    minX = Math.min(minX, topLeft.column);
    minY = Math.min(minY, topLeft.row);
    maxX = Math.max(maxX, topLeft.column + width);
    maxY = Math.max(maxY, topLeft.row + height);
  }

  return {
    origin: { column: minX, row: minY },
    width: maxX - minX,
    height: maxY - minY,
  };
}
