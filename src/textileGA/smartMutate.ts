import type { MutateAndKeepBestOptions } from './mutateAndKeepBest.ts';
import { Gene } from './Gene.ts';
import type { PatternPiece } from '../PatternPiece.ts';
import { clampPiecePosition } from '../utils/clampPiecesPosition.ts';
import type { Image } from 'image-js';
import type { MutateOptions } from './mutateTranslate.ts';

const MutationDirections = {
  LEFT: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
} as const;

type MutationDirections =
  (typeof MutationDirections)[keyof typeof MutationDirections];

const directionNames = ['LEFT', 'TOP', 'RIGHT', 'BOTTOM'] as const;

const nbDirections = 4;

export interface SmartMutateOptions extends MutateOptions {
  debug?: number;
}

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
  options: SmartMutateOptions = {},
): Gene {
  const { nbIterations = 5, debug = 0, translationAmplitude = 10 } = options;
  let bestGene = Gene.clone(gene);

  const nbPieces = gene.patternPieces.length;
  for (let iteration = 0; iteration < nbIterations; iteration++) {
    if (debug > 0) {
      console.log('smart mutate iteration ', iteration);
    }
    let improved = false;
    for (let i = 0; i < nbPieces; i++) {
      for (let direction = 0; direction < nbDirections; direction++) {
        while (true) {
          const currentGene = Gene.clone(bestGene);
          const piece = currentGene.patternPieces[i];
          movePiece(
            fabric,
            piece,
            direction as MutationDirections,
            translationAmplitude,
          );
          if (debug > 1) {
            console.log(
              `Iteration ${iteration}, piece ${i}, origin: (${piece.centerOrigin.column},${piece.centerOrigin.row}), score: ${bestGene.getFitness()}, direction ${directionNames[direction]}`,
            );
          }
          // new score is worse (higher), stop trying this direction
          if (currentGene.getFitness() >= bestGene.getFitness()) {
            if (debug > 1) {
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
      if (debug > 0) {
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
