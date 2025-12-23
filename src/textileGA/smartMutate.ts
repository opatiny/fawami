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
  for (let iteration = 0; iteration < nbIterations; iteration++) {
    let improved = false;
    for (let i = 0; i < nbPieces; i++) {
      for (let direction = 0; direction < nbDirections; direction++) {
        while (true) {
          const currentGene = Gene.clone(bestGene);
          const piece = currentGene.patternPieces[i];
          movePiece(fabric, piece, direction, translationAmplitude);
          if (debug) {
            console.log(
              `Iteration ${iteration}, piece ${i}, origin: (${piece.centerOrigin.column},${piece.centerOrigin.row}), score: ${bestGene.getFitness()}, direction ${MutationDirections[direction]}`,
            );
          }
          // new score is worse (higher), stop trying this direction
          if (currentGene.getFitness() >= bestGene.getFitness()) {
            if (debug) {
              console.log('no more improvements in this direction');
            }
            break;
          }
          bestGene = currentGene;
          improved = true;
        }
      }
    }
    if (improved == false) {
      // No improvement over the whole iteration, stop the process
      if (debug) {
        console.log(
          `No improvement in iteration ${iteration}, stopping early.`,
        );
      }
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
