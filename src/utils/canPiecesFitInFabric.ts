import type { Image } from 'image-js';
import type { PatternPieces } from '../PatternPiece.ts';

export function canPiecesFitInFabric(
  fabric: Image,
  patternPieces: PatternPieces,
): boolean {
  const fabricArea = fabric.width * fabric.height;
  let totalPiecesArea = 0;
  for (const piece of patternPieces) {
    totalPiecesArea += piece.meta.surface as number;
  }
  return totalPiecesArea <= fabricArea;
}
