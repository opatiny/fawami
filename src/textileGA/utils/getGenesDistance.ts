import type { PatternPiece } from '../../patternPiece/PatternPiece.ts';

import type { Gene } from '../Gene.ts';

export const DefaultDistanceOptions: GetGenesDistanceOptions = {
  centerWeight: 1,
  orientationWeight: 100,
};

export interface GetGenesDistanceOptions {
  /**
   * Weight for center distance.
   * @default 1
   */
  centerWeight?: number;
  /**
   * Weight for orientation distance.
   * @default 100
   */
  orientationWeight?: number;
  /**
   * Whether to output debug information.
   * @default false
   */
  debug?: boolean;
}

/**
 * Compute a distance between two sets of pattern pieces. Takes into account the distance between centers and the difference in orientation.
 * @param gene1 - First set of pattern pieces
 * @param gene2 - Second set of pattern pieces
 * @param options - Options for distance computation
 * @returns The computed distance
 */
export function getGenesDistance(
  gene1: Gene,
  gene2: Gene,
  options: GetGenesDistanceOptions = {},
): number {
  const { centerWeight = 1, orientationWeight = 100, debug = false } = options;

  if (gene1.patternPieces.length !== gene2.patternPieces.length) {
    throw new Error('Both genes must have the same length');
  }

  let centerDistance = 0;
  let orientationDistance = 0;

  for (let i = 0; i < gene1.patternPieces.length; i++) {
    const piece1 = gene1.patternPieces[i] as PatternPiece;
    const piece2 = gene2.patternPieces[i] as PatternPiece;

    const center1 = piece1.centerOrigin;
    const center2 = piece2.centerOrigin;

    // euclidean distance in pixels
    const distance = Math.round(
      Math.hypot(center1.row - center2.row, center1.column - center2.column),
    );

    centerDistance += distance;

    // orientation distance
    const orientation1 = piece1.orientation;
    const orientation2 = piece2.orientation;
    const orientationDiff = orientation1 === orientation2 ? 0 : 1;
    orientationDistance += orientationDiff;
  }

  if (debug) {
    console.log({ centerDistance, orientationDistance });
  }
  // divide by max dimension of fabric to make independent of fabric size
  const maxDim = Math.max(gene1.fabric.width, gene1.fabric.height);
  return (
    (centerDistance / maxDim) * centerWeight +
    orientationDistance * orientationWeight
  );
}
