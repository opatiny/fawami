import type { PatternPieces } from '../PatternPiece.ts';

import type { FitnessData } from './getFitness.ts';
import { getFitness } from './getFitness.ts';

export const DefaultFitnessOptions = {
  overlapWeight: 1,
  lengthWeight: 10,
};

export interface GeneOptions {
  fitnessOptions?: Partial<typeof DefaultFitnessOptions>;
}

export class Gene {
  public readonly data: PatternPieces;
  public readonly fitness: FitnessData;

  public constructor(patternPieces: PatternPieces, options: GeneOptions = {}) {
    this.data = patternPieces;
    this.fitness = getFitness(this.data, {
      ...DefaultFitnessOptions,
      ...options.fitnessOptions,
    });
  }

  toJSON() {
    return {
      fitness: this.fitness.score,
      overlapArea: this.fitness.overlapArea,
      usedLength: this.fitness.usedLength,
    };
  }
}
