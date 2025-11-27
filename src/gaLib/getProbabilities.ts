import type { ScoreType, ScoredIndividual } from './GeneticAlgorithm.ts';

export interface ProbabilitiesOptions {
  /**
   * Exponent to apply to the scores to compute probabilities
   * @default 1
   */
  exponent?: number;
  /**
   * Is a low score or high score better?
   * @default 'max'
   */
  scoreType?: ScoreType;
}

/**
 * Compute a probability distribution from the scores of the individuals.
 * The better the score, the higher the probability.
 * An exponent of 0 gives a uniform distribution.
 * @param individuals - Array of scored individuals
 * @param options - Options for computing probabilities
 * @returns Array of probabilities
 */
export function getProbabilities<Type>(
  individuals: Array<ScoredIndividual<Type>>,
  options: ProbabilitiesOptions = {},
): number[] {
  const { exponent = 1, scoreType = 'max' } = options;
  let totalScore = 0;
  const scores = [];
  for (const ind of individuals) {
    const currentValue =
      (scoreType === 'max' ? ind.score : 1 / ind.score) ** exponent;
    scores.push(currentValue);
    totalScore += currentValue;
  }
  return scores.map((score) => score / totalScore);
}
