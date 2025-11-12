import type { PatternPieces } from '../PatternPiece.ts';

import type { FitnessData, FitnessWeights } from './getFitness.ts';
import { getFitness } from './getFitness.ts';

export const DefaultFitnessWeights = {
  overlapWeight: 1,
  lengthWeight: 10,
};

export interface GeneOptions {
  fitnessWeights?: FitnessWeights;
}

export class Gene {
  public readonly data: PatternPieces;
  public readonly fitness: FitnessData;
  public readonly fitnessWeights: FitnessWeights = DefaultFitnessWeights;

  public constructor(patternPieces: PatternPieces, options: GeneOptions = {}) {
    this.data = patternPieces;
    this.fitness = getFitness(this.data, {
      ...DefaultFitnessWeights,
      ...options.fitnessWeights,
    });
    this.fitnessWeights = {
      ...DefaultFitnessWeights,
      ...options.fitnessWeights,
    };
  }

  toJSON() {
    return {
      fitness: this.fitness.score,
      overlapArea: this.fitness.overlapArea,
      usedLength: this.fitness.usedLength,
    };
  }
}
