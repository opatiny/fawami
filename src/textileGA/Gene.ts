import type { Image, Point } from 'image-js';
import {
  PatternPiece,
  type Orientation,
  type PatternPieces,
} from '../PatternPiece.ts';

import type { FitnessData, FitnessWeights } from './getFitness.ts';
import { DefaultFitnessWeights, getFitness } from './getFitness.ts';
import type { GetDataVectorOptions } from './utils/getDataVector.ts';
import { getDataVector } from './utils/getDataVector.ts';
import { drawPieces } from '../utils/drawPieces.ts';
import { Matrix } from 'ml-matrix';
import { initialiseOverlapMatrix } from './utils/initialiseOverlapMatrix.ts';

export interface GeneOptions {
  fitnessWeights?: FitnessWeights;
  overlapMatrix?: Matrix;
}

export class Gene {
  /**
   * Fabric associated with the gene.
   */
  public readonly fabric: Image;
  /**
   * Resolution of the pattern pieces associated with the gene in pixels/cm.
   */
  public readonly resolution: number;
  /**
   * Caution: the pattern pieces can still be moved and rotated
   */
  public readonly patternPieces: PatternPieces;
  /**
   *  Paramters to compute gene fitness.
   */
  public readonly fitnessWeights: FitnessWeights;
  /**
   * Matrice of overlap areas between pattern pieces in pixels.
   */
  public overlapMatrix: Matrix;

  private recomputeFitness: boolean;
  private score: number;

  public constructor(
    fabric: Image,
    patternPieces: PatternPieces,
    options: GeneOptions = {},
  ) {
    const { overlapMatrix = initialiseOverlapMatrix(patternPieces.length) } =
      options;
    // check pattern pieces all have same resolution
    const resolution = patternPieces[0].meta.resolution as number;
    for (const piece of patternPieces) {
      if (piece.meta.resolution !== resolution) {
        throw new Error('All pattern pieces must have the same resolution');
      }
    }
    this.resolution = resolution;
    this.fabric = fabric;
    this.patternPieces = patternPieces;
    this.fitnessWeights = {
      ...DefaultFitnessWeights,
      ...options.fitnessWeights,
    };
    this.overlapMatrix = overlapMatrix;
    this.recomputeFitness = true;
    this.score = Infinity;
  }

  public getFitnessData(): FitnessData {
    return getFitness(this.fabric, this.patternPieces, this.overlapMatrix, {
      weights: this.fitnessWeights,
    });
  }

  /**
   * Only recompute fitness if pieces were moved or rotated.
   * @returns
   */
  public getFitnessScore(): number {
    if (this.recomputeFitness) {
      this.recomputeFitness = false;
      this.score = this.getFitnessData().score;
    }
    return this.score;
  }

  /**
   * Clone a gene. The pattern pieces masks are not copied to save memory, but the origins and rotations are.
   * @param gene Gene to clone.
   * @returns Clone of the gene.
   */
  public static clone(gene: Gene): Gene {
    const newPieces: PatternPieces = [];
    for (const piece of gene.patternPieces) {
      newPieces.push(PatternPiece.clone(piece));
    }
    return new Gene(gene.fabric, newPieces, {
      fitnessWeights: gene.fitnessWeights,
      overlapMatrix: gene.overlapMatrix.clone(),
    });
  }

  toJSON() {
    const fitnessData = this.getFitnessData();
    return {
      fitness: fitnessData.score,
      overlapArea: fitnessData.overlapArea,
      usedLength: fitnessData.usedLength,
    };
  }

  public getDataVector(options: GetDataVectorOptions = {}): number[] {
    return getDataVector(this, options);
  }

  /**
   * Get the image corresponding to the gene.
   * @returns The gene image.
   */
  public getImage(): Image {
    const image = this.fabric.clone();
    drawPieces(image, this.patternPieces);
    return image;
  }

  /**
   * Set the origin of a pattern piece.
   * @param index - Index of the pattern piece.
   * @param origin - New origin.
   */
  public setOrigin(index: number, origin: Point): void {
    this.patternPieces[index].centerOrigin = origin;
    this.recomputeFitness = true;
  }

  /**
   * Set the orientation of a pattern piece.
   * @param index - Index of the pattern piece.
   * @param orientation - New orientation.
   */
  public setOrientation(index: number, orientation: Orientation): void {
    this.patternPieces[index].orientation = orientation;
    this.recomputeFitness = true;
  }
}
