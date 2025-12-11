import type { Image } from 'image-js';
import { PatternPiece, type PatternPieces } from '../PatternPiece.ts';

import type { FitnessData, FitnessWeights } from './getFitness.ts';
import { DefaultFitnessWeights, getFitness } from './getFitness.ts';
import type { GetDataVectorOptions } from './utils/getDataVector.ts';
import { getDataVector } from './utils/getDataVector.ts';
import { drawPieces } from '../utils/drawPieces.ts';

export interface GeneOptions {
  fitnessWeights?: FitnessWeights;
}

export class Gene {
  public readonly fabric: Image;
  public readonly patternPieces: PatternPieces;
  public readonly fitness: FitnessData;
  public readonly fitnessWeights: FitnessWeights;

  public constructor(
    fabric: Image,
    patternPieces: PatternPieces,
    options: GeneOptions = {},
  ) {
    this.fabric = fabric;
    this.patternPieces = patternPieces;
    this.fitnessWeights = {
      ...DefaultFitnessWeights,
      ...options.fitnessWeights,
    };

    this.fitness = getFitness(fabric, this.patternPieces, {
      weights: this.fitnessWeights,
    });
  }

  public static clone(gene: Gene): Gene {
    const newPieces: PatternPieces = [];
    for (const piece of gene.patternPieces) {
      newPieces.push(PatternPiece.clone(piece));
    }
    return new Gene(gene.fabric, newPieces, {
      fitnessWeights: gene.fitnessWeights,
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

  public getImage(): Image {
    const image = this.fabric.clone();
    drawPieces(image, this.patternPieces);
    return image;
  }
}
