import type { MutateAndKeepBestOptions } from './mutateAndKeepBest.ts';
import { Gene } from './Gene.ts';
import type { PatternPiece } from '../PatternPiece.ts';
import {
  clampPiecePosition,
  clampPiecesPosition,
} from '../utils/clampPiecesPosition.ts';
import type { Image } from 'image-js';

enum MutationDirections {
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
}
const nbDirections = 4;

/**
 * Mutate a gene and keep the best one of each generation.
 * @param fabric - The fabric image.
 * @param gene - The gene to mutate.
 * @param options - Options for mutation.
 * @returns The best mutated gene.
 */
export function smartMutate(
  fabric: Image,
  gene: Gene,
  options: MutateAndKeepBestOptions = {},
): Gene {
  const {
    nbIterations = 5,
    debug = false,
    translationAmplitude = 10,
  } = options;
  let bestGene = Gene.clone(gene);

  const nbPieces = gene.patternPieces.length;
  let bestScore = bestGene.getFitness();
  for (let iteration = 0; iteration < nbIterations; iteration++) {
    let improved = false;
    for (let i = 0; i < nbPieces; i++) {
      for (let direction = 0; direction < nbDirections; direction++) {
        const currentGene = Gene.clone(bestGene);
        const piece = currentGene.patternPieces[i];
        // a smaller score is better
        do {
          bestScore = currentGene.getFitness();
          const hadToClamp = movePiece(
            fabric,
            piece,
            direction,
            translationAmplitude,
          );
          if (debug) {
            console.log({
              iteration: iteration,
              piece: i,
              direction: MutationDirections[direction],
              origin: piece.centerOrigin,
              newScore: currentGene.getFitness(),
            });
          }
          if (hadToClamp) {
            // Can't move further in this direction
            break;
          }
        } while (bestGene.getFitness() < bestScore);
      }
    }
    if (improved == false) {
      // No improvement over the whole iteration, stop the process
      break;
    }
  }

  return bestGene;
}

/**
 * Translate a pattern piece in a given direction by a given amplitude (in place).
 * @param fabric
 * @param piece
 * @param direction
 * @param amplitude
 */
function movePiece(
  fabric: Image,
  piece: PatternPiece,
  direction: MutationDirections,
  amplitude: number,
): boolean {
  switch (direction) {
    case MutationDirections.LEFT:
      piece.centerOrigin.column -= amplitude;
      break;
    case MutationDirections.TOP:
      piece.centerOrigin.row -= amplitude;
      break;
    case MutationDirections.RIGHT:
      piece.centerOrigin.column += amplitude;
      break;
    case MutationDirections.BOTTOM:
      piece.centerOrigin.row += amplitude;
      break;
    default:
      throw new Error('Unknown direction');
  }
  // clamp piece position to be inside of fabric
  const hadToClamp = clampPiecePosition(fabric, piece);

  return hadToClamp;
}
