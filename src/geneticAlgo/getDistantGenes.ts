import { kmeans } from 'ml-kmeans';

import { Gene } from './Gene.ts';
import type { ScoredIndividual } from '../gaLib/GeneticAlgorithm.ts';

export interface GetDistantGenesOptions {
  /**
   * Number of genes to return
   * @default 10
   */
  numberOfGenes?: number;
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Return the N most different genes from the population using k-means clustering.
 * @param genes - Genes to select from
 * @param options - Options
 * @returns The most distant genes
 */
export function getDistantGenes(
  population: Gene[] | ScoredIndividual<Gene>[],
  options: GetDistantGenesOptions = {},
): Gene[] | ScoredIndividual<Gene>[] {
  const { numberOfGenes = 10, debug = false } = options;

  if (population.length < numberOfGenes) {
    throw new Error('Desired number of genes larger than population size');
  } else if (population.length === numberOfGenes) {
    return population;
  }

  const genes = (
    population[0] instanceof Gene
      ? population
      : population.map((individual) => individual.data)
  ) as Gene[];

  const data = genes.map((gene) => gene.getDataVector());
  const kmeansResult = kmeans(data, numberOfGenes, {});

  if (debug) {
    console.log('clusters:', kmeansResult.clusters);
  }

  const distantGenes: Gene[] = [];
  const selectedIndices = [];
  for (let i = 0; i < numberOfGenes; i++) {
    // find all indices of genes in cluster i
    const clusterIndices = kmeansResult.clusters
      .map((clusterIndex, geneIndex) => ({ clusterIndex, geneIndex }))
      .filter(({ clusterIndex }) => clusterIndex === i)
      .map(({ geneIndex }) => geneIndex);

    // select first gene in the cluster
    const selectedGeneIndex = clusterIndices[0];
    distantGenes.push(genes[selectedGeneIndex]);
    selectedIndices.push(selectedGeneIndex);
  }

  if (debug) {
    console.log(
      'Selected gene indices:',
      selectedIndices.toSorted((a, b) => a - b),
    );
  }

  return distantGenes;
}
