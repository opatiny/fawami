import fs from 'fs/promises';
import { join } from 'node:path';

import type { TextileGA } from './TextileGA.ts';

export interface TextileGAStats {
  runTime: {
    /**
     * Time taken for each iteration in seconds
     */
    iterations: number[];
    /**
     * Total time taken for all iterations in seconds
     */
    total: number;
  };
  /**
   * Packing of the best individual at each iteration (value between 0 and 1)
   */
  packings: number[];
}

export const DefaultStats: TextileGAStats = {
  runTime: {
    iterations: [],
    total: 0,
  },
  packings: [],
};

export interface SaveResultsOptions {
  /**
   * Path to the folder where to save the results file
   * @default textileGA.outdir
   */
  outdir?: string;

  /**
   * Name of the results file
   * @default 'results.json'
   */
  fileName?: string;
  debug?: boolean;
}

/**
 * Save a textile GA stats to a JSON file.
 * @param textileGA - TextileGA instance
 * @param options - Options
 */
export async function saveResults(
  textileGA: TextileGA,
  options: SaveResultsOptions,
): Promise<void> {
  const {
    outdir = textileGA.outdir as string,
    fileName = 'results.json',
    debug = false,
  } = options;

  if (debug) {
    console.log('Saving results to', join(outdir, fileName));
  }

  const data = { ...textileGA.stats, bestScores: textileGA.getBestScores() };
  const resultsString = JSON.stringify(data, null, 2);
  await fs.writeFile(join(outdir, fileName), resultsString, 'utf-8');
}
