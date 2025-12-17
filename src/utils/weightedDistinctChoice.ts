import { Random } from 'ml-random';

export interface WeightedChoiceOptions {
  /**
   * Weights defining the probability of each index to be chosen.
   */
  weights?: number[];
  /**
   * The random number generator to use.
   * @default New random generator without seed
   */
  randomGen?: Random;
}

/**
 * Compute nbIndices distinct random indices in a given range, taking into account weights (defining the probability of each index to be chosen).
 * By default, all weights are equal to 1 (uniform distribution).
 * @param nbIndices - Number of indexes to compute
 * @param arraySize - Size of the index array to pick from.
 * @param options - Options for weighted choice
 * @returns
 */
export function weightedDistinctChoice(
  nbIndices: number,
  arraySize: number,
  options: WeightedChoiceOptions = {},
): number[] {
  // by default weights are all set to 1
  const defaultWeights = new Array(arraySize).fill(1);

  const { weights = defaultWeights, randomGen = new Random() } = options;

  if (weights.length !== arraySize) {
    throw new Error(
      `weightedDistinctChoice: Weights length (${weights.length}) must be equal to array size (${arraySize})`,
    );
  }

  if (nbIndices > arraySize) {
    throw new Error(
      `weightedDistinctChoice: Number of indices to choose (${nbIndices}) cannot be greater than array size (${arraySize})`,
    );
  }

  if (nbIndices === arraySize) {
    return Array.from({ length: arraySize }, (_, i) => i);
  }

  const cumulatedWeights: number[] = [];
  let cumulatedSum = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulatedSum += weights[i];
    cumulatedWeights.push(cumulatedSum);
  }

  const chosenIndices: number[] = [];
  let currentCumulatedWeights = cumulatedWeights.slice();
  for (let n = 0; n < nbIndices; n++) {
    const data = getOneIndex(currentCumulatedWeights, randomGen);
    chosenIndices.push(data.index);
    currentCumulatedWeights = data.nextCumulatedWeights;
  }
  return chosenIndices;
}

interface ChoiceData {
  index: number;
  nextCumulatedWeights: number[];
}

function getOneIndex(
  cumulatedWeights: number[],
  randomGen: Random,
): ChoiceData {
  const totalWeight = cumulatedWeights[cumulatedWeights.length - 1];
  const rand = randomGen.random() * totalWeight;

  let index = 0;
  while (index < cumulatedWeights.length && rand > cumulatedWeights[index]) {
    index++;
  }

  const start = cumulatedWeights.slice(0, index);

  const end = cumulatedWeights.slice(index + 1);

  const nextCumulatedWeights = start.concat(
    end.map((w) => w - cumulatedWeights[index]),
  );

  return { index, nextCumulatedWeights };
}
