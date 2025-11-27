import type { PatternPieces } from '../PatternPiece.ts';

import type { FitnessData, FitnessWeights } from './getFitness.ts';
import { DefaultFitnessWeights, getFitness } from './getFitness.ts';
import type { GetDataVectorOptions } from './utils/getDataVector.ts';
import { getDataVector } from './utils/getDataVector.ts';

export interface GeneOptions {
  fitnessWeights?: FitnessWeights;
}

export class Gene {
  public readonly data: PatternPieces;
  public readonly fitness: FitnessData;
  public readonly fitnessWeights: FitnessWeights = DefaultFitnessWeights;

  public constructor(patternPieces: PatternPieces, options: GeneOptions = {}) {
    this.data = patternPieces;
    this.fitnessWeights = {
      ...DefaultFitnessWeights,
      ...options.fitnessWeights,
    };
    this.fitness = getFitness(this.data, {
      weights: this.fitnessWeights,
    });
  }

  toJSON() {
    return {
      fitness: this.fitness.score,
      overlapArea: this.fitness.overlapArea,
      usedLength: this.fitness.usedLength,
    };
  }

  public getDataVector(options: GetDataVectorOptions = {}): number[] {
    return getDataVector(this, options);
  }
}
